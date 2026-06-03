import { Router } from "express";
import { config } from "../config.js";
import { query } from "../db/pool.js";

const router = Router();

function siteUrl() {
  const base = (config.frontendUrl || "").trim().replace(/\/+$/, "");
  return base || "http://localhost:5173";
}

function xmlEscape(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

router.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(`User-agent: *
Allow: /

Sitemap: ${siteUrl()}/sitemap.xml
`);
});

router.get("/sitemap.xml", async (_req, res) => {
  const base = siteUrl();
  const urls = [
    { loc: `${base}/` },
    { loc: `${base}/contact` },
  ];

  const products = await query("SELECT id, updated_at FROM products WHERE is_visible = 1 ORDER BY id DESC");
  for (const p of products) {
    urls.push({
      loc: `${base}/product/${encodeURIComponent(String(p.id))}`,
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
    });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `\n    <lastmod>${xmlEscape(u.lastmod)}</lastmod>` : "";
        return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>${lastmod}\n  </url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  res.type("application/xml").send(body);
});

export default router;

