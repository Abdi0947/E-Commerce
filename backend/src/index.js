import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { pool, query } from "./db/pool.js";
import authRoutes, { ensureAdminUser } from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { seedProducts } from "./services/productService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
// app.use(
//   cors({
//     origin: config.frontendUrl,
//     credentials: true,
//   }),
// );
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

async function ensureProductSchema() {
  try {
    await query(
      "ALTER TABLE products ADD COLUMN is_visible TINYINT(1) NOT NULL DEFAULT 1 AFTER best_seller",
    );
    console.log("Added products.is_visible column.");
  } catch (err) {
    if (err.code !== "ER_DUP_FIELDNAME") throw err;
  }
}

async function bootstrap() {
  await pool.query("SELECT 1");
  await ensureProductSchema();
  await ensureAdminUser();

  // const rows = await query("SELECT id FROM products LIMIT 1");
  // if (rows.length === 0) {
  //   await seedProducts();
  //   console.log("Default products seeded.");
  // }
  

  app.listen(config.port, () => {
    console.log(`NinaMart API running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err.message);
  console.error("Check MySQL is running and .env credentials are correct.");
  process.exit(1);
});
