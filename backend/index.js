import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { uploadsStatic } from "./utils/uploadsStatic.js";
import { pool, query } from "./db/pool.js";
import authRoutes, { ensureAdminUser } from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import seoRoutes from "./routes/seo.routes.js";
import { seedProducts } from "./services/productService.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Serve uploaded media (use /api/files on cPanel when only /api is proxied to Node)
app.use("/api/files", uploadsStatic);
app.use("/api/files", (_req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).send("File not found");
});

// Legacy path (local dev or Apache public_html/uploads alias)
app.use("/uploads", uploadsStatic);
app.use("/uploads", (_req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).send("File not found");
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
const allowedOrigins = [
  "http://ninamart.ethioperparation.com",
  "https://ninamart.ethioperparation.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true); // ⚡ allows ANY origin (safe dev fix)
  },
  credentials: true
}));

app.options("*", cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", seoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/uploads", uploadRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status ?? err.statusCode;
  if (status === 404) {
    return res.status(404).send("Not found");
  }
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

  try {
    await query("ALTER TABLE products ADD COLUMN review_video TEXT NULL AFTER gallery");
    console.log("Added products.review_video column.");
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
