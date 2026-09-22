import {
  getToken,
  setToken,
  clearToken,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
} from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

export {
  getToken,
  setToken,
  clearToken,
  isAuthenticated,
  getRefreshToken,
  setRefreshToken,
  clearRefreshToken,
  setSession,
} from "./auth";

export function getApiUrl() {
  return API_URL;
}

/** Canonical API paths (Phase B + Parent web) */
export const paths = {
  // contracts / escrow
  contractsParent: "/contracts/mine/parent",
  contractsTeacher: "/contracts/mine/teacher",
  contract: (id: string) => `/contracts/${id}`,
  contractsCreate: "/contracts",
  escrowHold: (contractId: string) => `/escrow/${contractId}/hold`,
  escrowRelease: (contractId: string) => `/escrow/${contractId}/release`,

  // attendance
  attendanceCheckIn: "/attendance/check-in",
  attendanceCheckOut: "/attendance/check-out",
  attendanceByContract: (contractId: string) =>
    `/attendance/contract/${contractId}`,
  attendanceConfirm: (id: string) => `/attendance/${id}/confirm`,

   // progress
   progressMine: "/progress/mine",
   progressSubmit: (contractId: string) => `/progress/${contractId}`,
   progressGet: (contractId: string) => `/progress/${contractId}`,

    // contracts (alias for parent contracts used by calendar)
    contractsMine: "/contracts/mine/parent",

    // sessions
    sessionDetail: (id: string) => `/sessions/${id}`,

  // users
  usersMe: "/users/me",

  // teachers
  teachers: "/teachers",
  teacher: (id: string) => `/teachers/${id}`,

  // jobs
  jobsMine: "/jobs/mine",
  jobsCreate: "/jobs",
  job: (id: string) => `/jobs/${id}`,

  // children
  children: "/parents/children",
  child: (id: string) => `/parents/children/${id}`,

  // favorites
  favorites: "/favorites",
  favorite: (teacherId: string) => `/favorites/${teacherId}`,

  // wallet
  wallet: "/payments/wallet",

  // payments
  paymentsInitiate: "/payments/initiate",
  paymentStatus: (id: string) => `/payments/status/${id}`,
  paymentReconcile: (id: string) => `/payments/reconcile/${id}`,

  // teacher
  teacherEarnings: "/payments/earnings",
  payoutRequest: "/payments/payout",

  // notifications
  notifications: "/notifications",
  notificationRead: (id: string) => `/notifications/${id}/read`,
  notificationsReadAll: "/notifications/read-all",

    // subscriptions
    subscriptionMine: "/subscriptions/mine",
    subscriptionUpgrade: "/subscriptions/upgrade",

  // referrals
  referralsCode: "/referrals/code",
  referralsMine: "/referrals/mine",

    // support
    supportMine: "/support/mine",
    supportCreate: "/support",

    // risk / safety (teacher view of flags and restrictions)
    riskFlags: "/risk-flags",

    // matching
    matchingTutors: "/matching/tutors",

    // analytics
    analyticsMine: "/analytics/mine",

    // onboarding
    onboardingStatus: "/onboarding/status",

    // verification
    verificationStatus: "/verification/status",

    // availability
    availability: "/teacher/availability",

    // applications (teacher view of applications they submitted / received)
    applicationsMine: "/applications/mine",
    applicationsAction: (id: string) => `/applications/${id}/action`,

  // auth
  authRefresh: "/auth/refresh",
  authLogout: "/auth/logout",
} as const;

let currentRefresh: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  if (currentRefresh) return currentRefresh;

  const promise = (async (): Promise<string | null> => {
    try {
      const res = await fetch(API_URL + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      const newToken = data.accessToken;
      const newRefresh = data.refreshToken;
      if (newToken) setToken(newToken);
      if (newRefresh) setRefreshToken(newRefresh);
      return newToken;
    } catch {
      clearToken();
      clearRefreshToken();
      return null;
    } finally {
      currentRefresh = null;
    }
  })();

  currentRefresh = promise;
  return promise;
}

export async function logout() {
  const token = getToken();
  const refreshToken = getRefreshToken();
  if (token) {
    try {
      await fetch(API_URL + "/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore logout API errors
    }
  }
  clearToken();
  clearRefreshToken();
}

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

  const url = API_URL + (path.startsWith("/") ? path : "/" + path);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token) {
      const newToken = await tryRefresh();
      if (newToken) {
        (headers as any)["Authorization"] = `Bearer ${newToken}`;
        const retryRes = await fetch(url, {
          ...options,
          headers,
        });
        const retryData = await retryRes.json().catch(() => ({}));
        if (!retryRes.ok) {
          throw new Error(
            (retryData as any)?.message || `Request failed (${retryRes.status})`,
          );
        }
        return retryData as T;
      }
    }

    throw new Error(
      (data as any)?.message || `Request failed (${res.status})`,
    );
  }

  return data as T;
}
