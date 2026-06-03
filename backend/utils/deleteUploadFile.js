import fs from "fs/promises";
import path from "path";
import { uploadsDir } from "../config.js";

const UPLOAD_PREFIXES = ["/uploads/", "/api/files/"];

function uploadPathname(url) {
  if (!url || typeof url !== "string") return null;
  let pathname = url;
  if (!url.startsWith("/")) {
    try {
      pathname = new URL(url).pathname;
    } catch {
      return null;
    }
  }
  for (const prefix of UPLOAD_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return pathname.slice(prefix.length);
    }
  }
  return null;
}

export function isLocalUploadUrl(url) {
  return uploadPathname(url) !== null;
}

export function uploadUrlToFilesystemPath(url) {
  const relative = uploadPathname(url);
  if (!relative) return null;

  const filename = path.basename(relative);
  if (!filename || filename.includes("..")) return null;

  const resolved = path.resolve(uploadsDir, filename);
  const uploadsRoot = path.resolve(uploadsDir);
  if (!resolved.startsWith(uploadsRoot + path.sep) && resolved !== uploadsRoot) {
    return null;
  }
  return resolved;
}

export async function deleteLocalUpload(url) {
  const filePath = uploadUrlToFilesystemPath(url);
  if (!filePath) return false;
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}

export function collectProductImageUrls(product) {
  if (!product) return [];
  const urls = new Set();
  for (const url of [product.image, product.detailImage, product.reviewVideo]) {
    if (url) urls.add(url);
  }
  if (Array.isArray(product.gallery)) {
    for (const url of product.gallery) {
      if (url) urls.add(url);
    }
  }
  return [...urls];
}

export async function deleteProductUploadImages(product) {
  const urls = collectProductImageUrls(product).filter(isLocalUploadUrl);
  await Promise.all(urls.map((url) => deleteLocalUpload(url)));
}
