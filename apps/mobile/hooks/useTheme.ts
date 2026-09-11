import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeProvider";
import { colors, spacing, radius, typography, type ThemeMode } from "@tutor/ui";

/** Matches packages/ui theme tokens (light/dark) */
const fallbackColors = {
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
  text: "#0D2B2A",
  subtext: "#64748B",
  // Legacy aliases used across many screens
  bg: "#F0F9F8",
  sub: "#64748B",
  textSecondary: "#64748B",
};

function withAliases(base: Record<string, string>) {
  const foreground =
    base.foreground ?? base.text ?? fallbackColors.foreground;
  const mutedForeground =
    base.mutedForeground ?? base.subtext ?? fallbackColors.mutedForeground;
  const background = base.background ?? fallbackColors.background;

  return {
    ...fallbackColors,
    ...base,
    text: foreground,
    foreground,
    subtext: mutedForeground,
    mutedForeground,
    // Aliases screens already use (fixes CI)
    bg: background,
    sub: mutedForeground,
    textSecondary: mutedForeground,
  };
}

export function useTheme() {
  const context = useContext(ThemeContext);
  const mode: ThemeMode = context?.mode ?? "light";
  const raw =
    colors && (colors as any)[mode] ? (colors as any)[mode] : fallbackColors;
  const themeColors = withAliases(raw);

  return {
    mode,
    isDark: mode === "dark",
    colors: themeColors,
    spacing: spacing ?? {},
    radius: radius ?? {},
    typography: typography ?? {},
    toggleTheme: context?.toggleTheme ?? (() => {}),
    setMode: context?.setMode ?? (() => {}),
  };
}

export type { ThemeMode };
export default useTheme;