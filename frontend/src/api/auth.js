import { apiRequest, setToken, clearToken } from "./client.js";

export async function login(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getMe() {
  return apiRequest("/auth/me", { auth: true });
}

export function logout() {
  clearToken();
}
