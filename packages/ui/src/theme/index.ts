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
    neutral900: "#0F172A",
    neutral700: "#334155",
    neutral500: "#64748B",
    neutral300: "#CBD5E1",
    neutral100: "#F1F5F9",
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
    error: "#EF4444",
    errorLight: "#450A0A",
    info: "#38BDF8",
    infoLight: "#082F49",
    accent: "#F59E0B",
    ring: "#14B8A6",
    neutral900: "#0F172A",
    neutral700: "#334155",
    neutral500: "#64748B",
    neutral300: "#CBD5E1",
    neutral100: "#F1F5F9",
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
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
    sans: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  roles: {
    display: { fontSize: "48px", fontWeight: 800, lineHeight: 1.1 },
    h1: { fontSize: "36px", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "30px", fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: "24px", fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: "20px", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "16px", fontWeight: 600, lineHeight: 1.5 },
    bodyL: { fontSize: "16px", fontWeight: 400, lineHeight: 1.6 },
    bodyM: { fontSize: "14px", fontWeight: 400, lineHeight: 1.5 },
    bodyS: { fontSize: "12px", fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: "10px", fontWeight: 500, lineHeight: 1.4 },
    button: { fontSize: "14px", fontWeight: 600, lineHeight: 1.4 },
  },
} as const;

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  md: "0 4px 12px 0 rgba(13,148,136,0.08), 0 1px 3px 0 rgba(0,0,0,0.06)",
  lg: "0 10px 32px 0 rgba(13,148,136,0.12), 0 4px 8px 0 rgba(0,0,0,0.08)",
  xl: "0 20px 48px 0 rgba(13,148,136,0.18), 0 8px 16px 0 rgba(0,0,0,0.12)",
  tealGlow: "0 0 24px 0 rgba(20,184,166,0.25), 0 8px 32px 0 rgba(13,148,136,0.15)",
} as const;

export const grid = {
  mobile: 4,
  desktop: 12,
} as const;

export type ThemeMode = "light" | "dark";
export type ColorTokens = typeof colors.light;
