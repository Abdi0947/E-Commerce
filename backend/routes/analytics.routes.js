import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as analyticsService from "../services/analyticsService.js";

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: "Too many requests." },
});

router.post("/visit", trackLimiter, async (req, res) => {
  try {
    const sessionId = String(req.body.sessionId || "").trim();
    await analyticsService.recordSiteVisit(sessionId);
    res.json({ ok: true });
  } catch (err) {
    console.error("Record visit:", err);
    res.status(400).json({ error: err.message || "Failed to record visit." });
  }
});

router.post("/product-view", trackLimiter, async (req, res) => {
  try {
    const sessionId = String(req.body.sessionId || "").trim();
    const productId = Number(req.body.productId);
    if (!productId) return res.status(400).json({ error: "productId is required." });
    await analyticsService.recordProductView(sessionId, productId);
    res.json({ ok: true });
  } catch (err) {
    console.error("Record product view:", err);
    res.status(400).json({ error: err.message || "Failed to record view." });
  }
});

router.get("/summary", requireAuth, async (_req, res) => {
  try {
    const summary = await analyticsService.getAnalyticsSummary();
    res.json(summary);
  } catch (err) {
    console.error("Analytics summary:", err);
    res.status(500).json({ error: "Failed to load analytics." });
  }
});

router.get("/product-views", requireAuth, async (_req, res) => {
  try {
    const rows = await analyticsService.getProductViewsSorted();
    res.json(rows);
  } catch (err) {
    console.error("Product views:", err);
    res.status(500).json({ error: "Failed to load product views." });
  }
});

router.delete("/", requireAuth, async (_req, res) => {
  try {
    await analyticsService.resetAnalytics();
    res.json({ success: true });
  } catch (err) {
    console.error("Reset analytics:", err);
    res.status(500).json({ error: "Failed to reset analytics." });
  }
});

export default router;
