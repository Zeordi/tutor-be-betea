const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setRole(role: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

/** Call after successful login/register */
export function setSession(accessToken: string, refreshToken?: string, role?: string) {
  setToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
  if (role) setRole(role);
}