import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, "../../frontend/public/uploads");

export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "ninamart",
    password: process.env.DB_PASSWORD || "ninamart",
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