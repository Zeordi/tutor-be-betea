import { create } from "zustand";

interface ActiveSession {
  contractId: string;
  checkedIn: boolean;
  distanceMeters?: number;
  isVerifiedGeofence?: boolean;
}

interface SessionState {
  active: ActiveSession | null;
  setActive: (session: ActiveSession | null) => void;
  markCheckedIn: (meta: {
    distanceMeters: number;
    isVerifiedGeofence: boolean;
  }) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  active: null,
  setActive: (active) => set({ active }),
  markCheckedIn: (meta) =>
    set((state) =>
      state.active
        ? {
            active: {
              ...state.active,
              checkedIn: true,
              ...meta,
            },
          }
        : state,
    ),
}));