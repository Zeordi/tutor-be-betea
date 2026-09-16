import { getToken } from "./auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

export { getToken, clearToken, setToken, isAuthenticated } from "./auth";

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

  const url = API_URL + (path.startsWith("/") ? path : "/" + path);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as any)?.message || `Request failed (${res.status})`,
    );
  }

  return data as T;
}