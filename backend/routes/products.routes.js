import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as productService from "../services/productService.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await productService.listProducts({ admin: false });
    res.json(products);
  } catch (err) {
    console.error("List products:", err);
    res.status(500).json({ error: "Failed to load products." });
  }
});

router.get("/manage/all", requireAuth, async (_req, res) => {
  try {
    const products = await productService.listProducts({ admin: true });
    res.json(products);
  } catch (err) {
    console.error("List admin products:", err);
    res.status(500).json({ error: "Failed to load products." });
  }
});

router.post("/seed/reset", requireAuth, async (_req, res) => {
  try {
    const products = await productService.seedProducts();
    res.json(products);
  } catch (err) {
    console.error("Seed products:", err);
    res.status(500).json({ error: "Failed to reset catalogue." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id, { publicOnly: true });
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (err) {
    console.error("Get product:", err);
    res.status(500).json({ error: "Failed to load product." });
  }
});

router.post("/:id/hide", requireAuth, async (req, res) => {
  try {
    const ok = await productService.hideProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: "Product not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Hide product:", err);
    res.status(500).json({ error: "Failed to hide product." });
  }
});

router.post("/:id/restore", requireAuth, async (req, res) => {
  try {
    const ok = await productService.restoreProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: "Product not found." });
    const updated = await productService.getProductById(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error("Restore product:", err);
    res.status(500).json({ error: "Failed to restore product." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product:", err);
    res.status(500).json({ error: "Failed to create product." });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (err) {
    console.error("Update product:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const ok = await productService.deleteProductPermanently(req.params.id);
    if (!ok) return res.status(404).json({ error: "Product not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete product:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

export default router;
