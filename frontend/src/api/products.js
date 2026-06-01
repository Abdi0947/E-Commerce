import { apiRequest } from "./client.js";

export function fetchProducts() {
  return apiRequest("/products");
}

export function fetchProductsForAdmin() {
  return apiRequest("/products/manage/all", { auth: true });
}

export function fetchProduct(id) {
  return apiRequest(`/products/${id}`);
}

export function createProduct(product) {
  return apiRequest("/products", {
    method: "POST",
    auth: true,
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return apiRequest(`/products/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(product),
  });
}

/** Hide product from storefront (keeps in database). */
export function hideProduct(id) {
  return apiRequest(`/products/${id}/hide`, {
    method: "POST",
    auth: true,
  });
}

/** Permanently delete product from database. */
export function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export function restoreProduct(id) {
  return apiRequest(`/products/${id}/restore`, {
    method: "POST",
    auth: true,
  });
}

export function resetProductsCatalogue() {
  return apiRequest("/products/seed/reset", {
    method: "POST",
    auth: true,
  });
}
