const TOKEN_KEY = "token";
const ROLE_KEY = "role";

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
}

export function isAuthenticated(): boolean {
  return !!getToken();
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
export function setSession(accessToken: string, role?: string) {
  setToken(accessToken);
  if (role) setRole(role);
}