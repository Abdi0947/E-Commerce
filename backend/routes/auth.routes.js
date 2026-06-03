import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { query } from "../db/pool.js";
import { config } from "../config.js";
import { requireAuth, signAdminToken } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const rows = await query("SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1", {
      email,
    });
    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signAdminToken(admin);
    res.json({
      token,
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ admin: req.admin });
});

export default router;

export async function ensureAdminUser() {
  const rows = await query("SELECT id FROM admins LIMIT 1");
  if (rows.length > 0) return;

  const hash = await bcrypt.hash(config.admin.password, 12);
  await query("INSERT INTO admins (email, password_hash) VALUES (:email, :hash)", {
    email: config.admin.email,
    hash,
  });
  console.log(`Default admin created: ${config.admin.email}`);
}
