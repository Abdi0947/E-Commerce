import { config } from "../config.js";

/** Public URL path or full URL stored in DB and used by the storefront. */
export function publicUploadUrl(filename) {
  const base = config.uploadsPublicUrl.replace(/\/$/, "");
  const name = String(filename || "").replace(/^\/+/, "");
  if (!name) return base;
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return `${base}/${name}`;
  }
  return `${base}/${name}`;
}

/** Normalize legacy /uploads/... paths to the current public URL. */
export function normalizeStoredUploadUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

  const legacyMatch = trimmed.match(/^\/?uploads\/(.+)$/i);
  if (legacyMatch) {
    return publicUploadUrl(legacyMatch[1]);
  }

  const filesMatch = trimmed.match(/^\/?api\/files\/(.+)$/i);
  if (filesMatch) {
    return publicUploadUrl(filesMatch[1]);
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
