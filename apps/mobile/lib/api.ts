import * as SecureStore from "expo-secure-store";

// Use your Codespace API forwarded URL or default local fallback
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch {
    return null;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T = any>(url: string) => apiRequest<T>(url, { method: "GET" }),
  post: <T = any>(url: string, body: any) =>
    apiRequest<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T = any>(url: string, body: any) =>
    apiRequest<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T = any>(url: string) => apiRequest<T>(url, { method: "DELETE" }),
};

export default api;