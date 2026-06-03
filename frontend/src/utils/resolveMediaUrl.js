/**
 * Base URL for uploaded files.
 * - Relative: /api/files (same domain, /api proxied to Node)
 * - Full URL: https://yourdomain.com/api/files (recommended on cPanel when img tags need absolute URLs)
 */
function getUploadsBase() {
  const explicit = import.meta.env.VITE_UPLOADS_PUBLIC_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const apiBase = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
  if (/^https?:\/\//i.test(apiBase)) {
    return `${apiBase}/files`;
  }
  return "/api/files";
}

function extractUploadFilename(url) {
  const legacy = url.match(/^\/?uploads\/(.+)$/i);
  if (legacy) return legacy[1];
  const apiFiles = url.match(/^\/?api\/files\/(.+)$/i);
  if (apiFiles) return apiFiles[1];
  return null;
}

/** Turn stored paths into URLs the browser can load in dev and production. */
export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return trimmed;

  const filename = extractUploadFilename(trimmed);
  if (filename) {
    return `${getUploadsBase()}/${filename}`;
  }

  if (trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
}

export function videoMimeFromUrl(url) {
  const ext = (url || "").split("?")[0].split(".").pop()?.toLowerCase();
  const map = {
    mp4: "video/mp4",
    m4v: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    ogg: "video/ogg",
  };
  return map[ext] || "video/mp4";
}
