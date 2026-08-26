import { create } from "zustand";

export interface AuthUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";
  status?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}));