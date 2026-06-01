import { apiRequest } from "./client.js";

export function recordVisitApi(sessionId) {
  return apiRequest("/analytics/visit", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  }).catch(() => {});
}

export function recordProductViewApi(sessionId, productId) {
  return apiRequest("/analytics/product-view", {
    method: "POST",
    body: JSON.stringify({ sessionId, productId }),
  }).catch(() => {});
}

export function fetchAnalyticsSummary() {
  return apiRequest("/analytics/summary", { auth: true });
}

export function fetchProductViews() {
  return apiRequest("/analytics/product-views", { auth: true });
}

export function resetAnalyticsApi() {
  return apiRequest("/analytics", { method: "DELETE", auth: true });
}
