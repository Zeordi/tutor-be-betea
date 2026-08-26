import { getToken, clearToken } from "./api";

export function isAdminAuthenticated(): boolean {
  return Boolean(getToken());
}

export function logoutAdmin() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}