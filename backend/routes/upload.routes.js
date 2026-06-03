import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { uploadImage, uploadVideo } from "../middleware/upload.js";
import { publicUploadUrl } from "../utils/uploadUrl.js";

const router = Router();

router.post("/image", requireAuth, (req, res) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5MB."
          : err.message || "Upload failed.";
      return res.status(400).json({ error: message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const url = publicUploadUrl(req.file.filename);
    res.status(201).json({
      url,
      filename: req.file.filename,
    });
  });
});

router.post("/video", requireAuth, (req, res) => {
  uploadVideo.single("video")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Video must be smaller than 50MB."
          : err.message || "Upload failed.";
      return res.status(400).json({ error: message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No video file provided." });
    }

    const url = publicUploadUrl(req.file.filename);
    res.status(201).json({
      url,
      filename: req.file.filename,
    });
  });
});

export default router;
