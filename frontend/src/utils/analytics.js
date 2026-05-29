const STORAGE_KEY = "aero_analytics";
const SESSION_KEY = "aero_session_id";

const defaultAnalytics = () => ({
  totalVisits: 0,
  uniqueSessionIds: [],
  productViews: {},
  lastVisitAt: null,
});

function normalizeProductViewEntry(entry) {
  if (typeof entry === "number") {
    return { count: entry, lastViewedAt: null, firstViewedAt: null };
  }
  if (entry && typeof entry === "object") {
    return {
      count: Number(entry.count) || 0,
      lastViewedAt: entry.lastViewedAt || null,
      firstViewedAt: entry.firstViewedAt || null,
    };
  }
  return { count: 0, lastViewedAt: null, firstViewedAt: null };
}

function normalizeProductViews(raw) {
  if (!raw || typeof raw !== "object") return {};
  return Object.fromEntries(
    Object.entries(raw).map(([id, entry]) => [id, normalizeProductViewEntry(entry)])
  );
}

function readAnalytics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAnalytics();
    const data = JSON.parse(raw);
    return {
      totalVisits: Number(data.totalVisits) || 0,
      uniqueSessionIds: Array.isArray(data.uniqueSessionIds) ? data.uniqueSessionIds : [],
      productViews: normalizeProductViews(data.productViews),
      lastVisitAt: data.lastVisitAt || null,
    };
  } catch {
    return defaultAnalytics();
  }
}

function writeAnalytics(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function totalDetailViews(productViews) {
  return Object.values(productViews).reduce((sum, entry) => sum + entry.count, 0);
}

/** Call once per storefront visit (not on admin). */
export function recordSiteVisit() {
  const data = readAnalytics();
  const sessionId = getOrCreateSessionId();

  data.totalVisits += 1;
  data.lastVisitAt = new Date().toISOString();

  if (!data.uniqueSessionIds.includes(sessionId)) {
    data.uniqueSessionIds.push(sessionId);
  }

  writeAnalytics(data);
}

/** Call when a user opens a product detail page. */
export function recordProductView(productId) {
  if (productId == null || productId === "") return;
  const data = readAnalytics();
  const key = String(productId);
  const now = new Date().toISOString();
  const existing = data.productViews[key] || normalizeProductViewEntry(null);

  data.productViews[key] = {
    count: existing.count + 1,
    firstViewedAt: existing.firstViewedAt || now,
    lastViewedAt: now,
  };

  writeAnalytics(data);
}

export function getAnalyticsSummary() {
  const data = readAnalytics();
  return {
    totalVisits: data.totalVisits,
    uniqueVisitors: data.uniqueSessionIds.length,
    productViews: { ...data.productViews },
    totalDetailViews: totalDetailViews(data.productViews),
    lastVisitAt: data.lastVisitAt,
  };
}

export function getProductViewsSorted(products = []) {
  const { productViews } = readAnalytics();
  const byId = new Map(products.map((p) => [String(p.id), p]));

  return Object.entries(productViews)
    .map(([id, entry]) => {
      const product = byId.get(id);
      return {
        id,
        views: entry.count,
        lastViewedAt: entry.lastViewedAt,
        firstViewedAt: entry.firstViewedAt,
        name: product?.name || `Product #${id}`,
        category: product?.category || "—",
        image: product?.image || "",
      };
    })
    .sort((a, b) => b.views - a.views);
}

export function resetAnalytics() {
  localStorage.removeItem(STORAGE_KEY);
}
