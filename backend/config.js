import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Where files are saved on disk.
 * cPanel: set UPLOADS_DIR to an absolute path, e.g.
 *   /home/username/public_html/uploads
 *   or /home/username/ninamart-api/uploads
 */
const defaultUploadsDir = path.resolve(__dirname, "uploads");
export const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : defaultUploadsDir;

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * URL path (or full URL) the browser uses to load uploads.
 * cPanel: use /api/files when only /api is proxied to Node (recommended).
 * Or /uploads if files live in public_html/uploads and Apache serves them.
 */
export const uploadsPublicUrl =
  process.env.UPLOADS_PUBLIC_URL?.trim() || "/api/files";

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  uploadsDir,
  uploadsPublicUrl,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "ninmart",
    password: process.env.DB_PASSWORD || "ninmart",
    database: process.env.DB_NAME || "ninamart",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-only-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  admin: {
    email: (process.env.ADMIN_EMAIL || "admin@ninamart.com").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "aero2025",
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
