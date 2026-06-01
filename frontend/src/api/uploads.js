import { apiUpload } from "./client.js";

export function uploadProductImage(file) {
  return apiUpload("/uploads/image", file, "image");
}
