import { query } from "../db/pool.js";
import { normalizeStoredUploadUrl } from "../utils/uploadUrl.js";

export async function recordSiteVisit(sessionId) {
  if (!sessionId || typeof sessionId !== "string" || sessionId.length > 64) {
    throw new Error("Invalid session id");
  }

  await query(
    `INSERT INTO visitor_sessions (session_id) VALUES (:sessionId)
     ON DUPLICATE KEY UPDATE session_id = session_id`,
    { sessionId },
  );

  await query("INSERT INTO site_visits (session_id) VALUES (:sessionId)", { sessionId });
}

export async function recordProductView(sessionId, productId) {
  if (!sessionId || !productId) throw new Error("Invalid payload");

  await query(
    `INSERT INTO visitor_sessions (session_id) VALUES (:sessionId)
     ON DUPLICATE KEY UPDATE session_id = session_id`,
    { sessionId },
  );

  const now = new Date();
  await query(
    `INSERT INTO product_view_stats (product_id, view_count, first_viewed_at, last_viewed_at)
     VALUES (:productId, 1, :now, :now)
     ON DUPLICATE KEY UPDATE
       view_count = view_count + 1,
       last_viewed_at = :now`,
    { productId, now },
  );
}

export async function getAnalyticsSummary() {
  const [visitRows, uniqueRows, viewRows, lastVisitRows] = await Promise.all([
    query("SELECT COUNT(*) AS total FROM site_visits"),
    query("SELECT COUNT(*) AS total FROM visitor_sessions"),
    query("SELECT COALESCE(SUM(view_count), 0) AS total FROM product_view_stats"),
    query("SELECT MAX(visited_at) AS lastVisitAt FROM site_visits"),
  ]);

  return {
    totalVisits: Number(visitRows[0]?.total) || 0,
    uniqueVisitors: Number(uniqueRows[0]?.total) || 0,
    totalDetailViews: Number(viewRows[0]?.total) || 0,
    lastVisitAt: lastVisitRows[0]?.lastVisitAt || null,
  };
}

export async function getProductViewsSorted() {
  const rows = await query(
    `SELECT
      pvs.product_id AS id,
      pvs.view_count AS views,
      pvs.first_viewed_at AS firstViewedAt,
      pvs.last_viewed_at AS lastViewedAt,
      p.name,
      p.category,
      p.image
    FROM product_view_stats pvs
    LEFT JOIN products p ON p.id = pvs.product_id
    WHERE pvs.view_count > 0
    ORDER BY pvs.view_count DESC`,
  );

  return rows.map((row) => ({
    id: String(row.id),
    views: Number(row.views) || 0,
    firstViewedAt: row.firstViewedAt,
    lastViewedAt: row.lastViewedAt,
    name: row.name || `Product #${row.id}`,
    category: row.category || "—",
    image: row.image ? normalizeStoredUploadUrl(row.image) : "",
  }));
}

export async function resetAnalytics() {
  await query("DELETE FROM site_visits");
  await query("DELETE FROM visitor_sessions");
  await query("DELETE FROM product_view_stats");
}
