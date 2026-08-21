export const colors = {
  light: {
    background: "#FFFFFF",
    foreground: "#0F172A",
    surface: "#F8FAFC",
    primary: "#0F766E",          // Premium Teal
    primaryForeground: "#FFFFFF",
    secondary: "#64748B",
    muted: "#F1F5F9",
    border: "#E2E8F0",
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    card: "#FFFFFF",
  },
  dark: {
    background: "#0F172A",
    foreground: "#F8FAFC",
    surface: "#1E293B",
    primary: "#2DD4BF",
    primaryForeground: "#0F172A",
    secondary: "#94A3B8",
    muted: "#1E293B",
    border: "#334155",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    card: "#1E293B",
  },
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
} as const;

export type ThemeMode = "light" | "dark";
