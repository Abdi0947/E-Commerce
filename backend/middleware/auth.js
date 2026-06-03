import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.admin = { id: payload.adminId, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

export function signAdminToken(admin) {
  return jwt.sign(
    { adminId: admin.id, email: admin.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
}
