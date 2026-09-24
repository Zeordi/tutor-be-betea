import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

const REQUEST_TIMEOUT = 25_000;

export function getApiUrl() {
  return API_URL;
}

/** Canonical API paths (Phase B + Phase E) */
export const paths = {
  contractsParent: "/contracts/mine/parent",
  contractsTeacher: "/contracts/mine/teacher",
  contract: (id: string) => `/contracts/${id}`,
  contractsCreate: "/contracts",
  attendanceCheckIn: "/attendance/check-in",
  attendanceCheckOut: "/attendance/check-out",
  attendanceByContract: (contractId: string) =>
    `/attendance/contract/${contractId}`,
  attendanceConfirm: (id: string) => `/attendance/${id}/confirm`,
  progressMine: "/progress/mine",
  progressSubmit: (contractId: string) => `/progress/${contractId}`,
  progressGet: (contractId: string) => `/progress/${contractId}`,
  usersMe: "/users/me",
  teachers: "/teachers",
  teacher: (id: string) => `/teachers/${id}`,
  teachersProfileLocation: "/teachers/profile/location",
  jobsMine: "/jobs/mine",
  jobsOpen: "/jobs/open",
  jobsCreate: "/jobs",
  job: (id: string) => `/jobs/${id}`,
  jobApply: (jobId: string) => `/jobs/${jobId}/apply`,

  // applications (teacher view of applications they submitted)
  jobsApplicationsMine: "/jobs/applications/mine",

  // children
  children: "/parents/children",
  child: (id: string) => `/parents/children/${id}`,
  favorites: "/favorites",
  favorite: (teacherId: string) => `/favorites/${teacherId}`,
  wallet: "/payments/wallet",
  teacherEarnings: "/payments/earnings",
  paymentsInitiate: "/payments/initiate",
  paymentReconcile: (id: string) => `/payments/reconcile/${id}`,
  payoutRequest: "/payments/payout",
  notifications: "/notifications",
  notificationsPushToken: "/notifications/push-token",
  replacements: "/replacements",
  chatConversations: "/chat/conversations",
  notificationRead: (id: string) => `/notifications/${id}/read`,
  notificationsReadAll: "/notifications/read-all",
  subscriptionMine: "/subscriptions/mine",
  subscriptionUpgrade: "/subscriptions/upgrade",
  subscriptionsPlans: "/subscriptions/plans",
  referralsCode: "/referrals/code",
  referralsMine: "/referrals/mine",

  // connects
  connectsBalance: "/connects/balance",
  connectsTopUp: "/connects/top-up",
  vaultUpload: "/vault/upload",
  vaultTeacherDocuments: (teacherId: string) =>
    `/vault/teacher/${teacherId}`,
  badgesTeacher: (teacherId: string) => `/badges/teacher/${teacherId}`,
  availabilityMine: "/availability/mine",
  availabilitySlots: "/availability/slots",
  availabilityPackages: "/availability/packages",
  chatMessages: (roomId: string) => `/chat/${roomId}/messages`,
  chatSendMessage: (roomId: string) => `/chat/${roomId}/messages`,
  videoSession: "/video/session",
  supportCreate: "/support",
  supportMine: "/support/mine",
  supportTicket: (id: string) => `/support/ticket/${id}`,
  supportByContract: (contractId: string) => `/support/contract/${contractId}`,
  offlineSyncAttendance: "/offline/attendance",
  offlineSyncProgress: "/offline/progress",
  offlineSyncSupport: "/offline/support",
  authRefresh: "/auth/refresh",
  authLogout: "/auth/logout",
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

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("refresh_token");
  } catch {
    return null;
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync("refresh_token", token);
}

export async function setSession(
  token: string,
  refreshToken?: string,
  role?: string,
  userJson?: string,
): Promise<void> {
  await SecureStore.setItemAsync("auth_token", token);
  if (refreshToken) await SecureStore.setItemAsync("refresh_token", refreshToken);
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
  await SecureStore.deleteItemAsync("refresh_token");
}

let currentRefresh: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  if (currentRefresh) return currentRefresh;

  const promise = (async (): Promise<string | null> => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      const res = await fetch(API_URL + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      const newToken = data.accessToken;
      const newRefresh = data.refreshToken;
      if (newToken) await setToken(newToken);
      if (newRefresh) await setRefreshToken(newRefresh);
      return newToken;
    } catch {
      await clearToken();
      return null;
    } finally {
      currentRefresh = null;
    }
  })();

  currentRefresh = promise;
  return promise;
}

export async function logout(): Promise<void> {
  const token = await getToken();
  const refreshToken = await getRefreshToken();
  if (token) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      await fetch(API_URL + "/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });
      clearTimeout(timer);
    } catch {
      // ignore logout API errors
    }
  }
  await clearToken();
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const response = await fetch(url, { ...options, headers, signal: controller.signal });
  clearTimeout(timer);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401 && token) {
      const newToken = await tryRefresh();
      if (newToken) {
        headers.Authorization = "Bearer " + newToken;
        const retryController = new AbortController();
        const retryTimer = setTimeout(() => retryController.abort(), REQUEST_TIMEOUT);
        const retryRes = await fetch(url, { ...options, headers, signal: retryController.signal });
        clearTimeout(retryTimer);
        if (!retryRes.ok) {
          const retryError = await retryRes.json().catch(() => ({}));
          throw new Error(
            (retryError as any).message ||
              "Request failed (" + retryRes.status + ")",
          );
        }
        return retryRes.json();
      }
    }
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
