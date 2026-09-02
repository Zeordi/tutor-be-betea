export const colors = {
  light: {
    background: "#F0F9F8",
    foreground: "#0D2B2A",
    surface: "#FFFFFF",
    surface2: "#F1F5F9",
    card: "#FFFFFF",
    primary: "#0D9488",
    primaryDark: "#0F766E",
    primaryLight: "#CCFBF1",
    primaryForeground: "#FFFFFF",
    secondary: "#1E40AF",
    secondaryForeground: "#FFFFFF",
    muted: "#F1F5F9",
    mutedForeground: "#64748B",
    border: "#E2E8F0",
    success: "#059669",
    successLight: "#D1FAE5",
    warning: "#D97706",
    warningLight: "#FEF3C7",
    error: "#DC2626",
    errorLight: "#FEE2E2",
    info: "#0284C7",
    infoLight: "#E0F2FE",
    accent: "#F59E0B",
    ring: "#0D9488",
  },
  dark: {
    background: "#0A1628",
    foreground: "#F0FAFA",
    surface: "#112240",
    surface2: "#1E3A5F",
    card: "#112240",
    primary: "#14B8A6",
    primaryDark: "#0D9488",
    primaryLight: "#134E4A",
    primaryForeground: "#FFFFFF",
    secondary: "#3B82F6",
    secondaryForeground: "#FFFFFF",
    muted: "#1E3A5F",
    mutedForeground: "#94A3B8",
    border: "#1E3A5F",
    success: "#10B981",
    successLight: "#064E3B",
    warning: "#F59E0B",
    warningLight: "#451A03",
    error: "#F87171",
    errorLight: "#450A0A",
    info: "#38BDF8",
    infoLight: "#082F49",
    accent: "#F59E0B",
    ring: "#14B8A6",
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
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: "'Plus Jakarta Sans', Inter, system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  md: "0 4px 12px 0 rgba(13,148,136,0.08), 0 1px 3px 0 rgba(0,0,0,0.06)",
  lg: "0 10px 32px 0 rgba(13,148,136,0.12), 0 4px 8px 0 rgba(0,0,0,0.08)",
} as const;

export type ThemeMode = "light" | "dark";