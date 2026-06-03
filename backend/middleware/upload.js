import fs from "fs";
import path from "path";
import multer from "multer";
import { uploadsDir } from "../config.js";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const ext = path.extname(safeName) || ".jpg";
    const base = path.basename(safeName, ext) || "image";
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const imageFilter = (_req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) {
    cb(null, true);
    return;
  }
  cb(new Error("Only image files are allowed."));
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
