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
  // Aliases used by older screens / habits
  text: "#0D2B2A",
  subtext: "#64748B",
};

function withAliases(base: Record<string, string>) {
  return {
    ...fallbackColors,
    ...base,
    // Stable aliases so both patterns work
    text: (base as any).foreground ?? (base as any).text ?? fallbackColors.text,
    subtext:
      (base as any).mutedForeground ??
      (base as any).subtext ??
      fallbackColors.subtext,
    foreground:
      (base as any).foreground ?? (base as any).text ?? fallbackColors.foreground,
    mutedForeground:
      (base as any).mutedForeground ??
      (base as any).subtext ??
      fallbackColors.mutedForeground,
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