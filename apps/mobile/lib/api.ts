import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

export function getApiUrl() {
  return API_URL;
}

/** Canonical API paths (Phase B) */
export const paths = {
  contractsParent: "/contracts/mine/parent",
  contractsTeacher: "/contracts/mine/teacher",
  contract: (id: string) => `/contracts/${id}`,
  contractsCreate: "/contracts",
  escrowHold: (contractId: string) => `/escrow/${contractId}/hold`,
  attendanceCheckIn: "/attendance/check-in",
  attendanceCheckOut: "/attendance/check-out",
  attendanceByContract: (contractId: string) =>
    `/attendance/contract/${contractId}`,
  progressSubmit: (contractId: string) => `/progress/${contractId}`,
  progressGet: (contractId: string) => `/progress/${contractId}`,
  usersMe: "/users/me",
} as const;

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync("auth_token", token);
}

export async function setSession(
  token: string,
  role?: string,
  userJson?: string,
): Promise<void> {
  await SecureStore.setItemAsync("auth_token", token);
  if (role) await SecureStore.setItemAsync("auth_role", role);
  if (userJson) await SecureStore.setItemAsync("auth_user", userJson);
}

export async function getRole(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("auth_role");
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync("auth_token");
  await SecureStore.deleteItemAsync("auth_user");
  await SecureStore.deleteItemAsync("auth_role");
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  const url = API_URL + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as any).message ||
        "Request failed (" + response.status + ")",
    );
  }
  return response.json();
}

export const api = {
  get: <T = any>(url: string) => apiRequest<T>(url, { method: "GET" }),
  post: <T = any>(url: string, body: any) =>
    apiRequest<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T = any>(url: string, body: any) =>
    apiRequest<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T = any>(url: string) =>
    apiRequest<T>(url, { method: "DELETE" }),
};

export default api;