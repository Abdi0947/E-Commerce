import express from "express";
import path from "path";
import { uploadsDir } from "../config.js";

const VIDEO_MIME = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogg": "video/ogg",
};

export const uploadsStatic = express.static(uploadsDir, {
  fallthrough: true,
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (VIDEO_MIME[ext]) {
      res.setHeader("Content-Type", VIDEO_MIME[ext]);
      res.setHeader("Accept-Ranges", "bytes");
    }
    res.setHeader("Cache-Control", "public, max-age=86400");
  },
});
