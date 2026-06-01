import {
  recordVisitApi,
  recordProductViewApi,
  fetchAnalyticsSummary,
  fetchProductViews,
  resetAnalyticsApi,
} from "../api/analytics.js";

const SESSION_KEY = "aero_session_id";

function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

/** Call once per storefront visit (not on admin). */
export function recordSiteVisit() {
  recordVisitApi(getOrCreateSessionId());
}

/** Call when a user opens a product detail page. */
export function recordProductView(productId) {
  if (productId == null || productId === "") return;
  recordProductViewApi(getOrCreateSessionId(), productId);
}

export async function getAnalyticsSummary() {
  return fetchAnalyticsSummary();
}

export async function getProductViewsSorted() {
  return fetchProductViews();
}

export async function resetAnalytics() {
  await resetAnalyticsApi();
}
