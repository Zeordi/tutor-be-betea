import { getToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

export { getToken, clearToken, setToken, isAuthenticated } from "./auth";

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
  escrowRelease: (contractId: string) => `/escrow/${contractId}/release`,
  attendanceCheckIn: "/attendance/check-in",
  attendanceCheckOut: "/attendance/check-out",
  attendanceByContract: (contractId: string) =>
    `/attendance/contract/${contractId}`,
  attendanceConfirm: (id: string) => `/attendance/${id}/confirm`,
  progressMine: "/progress/mine",
  progressSubmit: (contractId: string) => `/progress/${contractId}`,
  progressGet: (contractId: string) => `/progress/${contractId}`,
  usersMe: "/users/me",
} as const;

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(
    `\( {API_URL} \){path.startsWith("/") ? path : `/${path}`}`,
    {
      ...options,
      headers,
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as any)?.message || `Request failed (${res.status})`,
    );
  }

  return data as T;
}