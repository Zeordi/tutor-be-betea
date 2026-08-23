import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeProvider";
import { colors, spacing, radius, typography, type ThemeMode } from "@tutor/ui";

// Default fallback colors in case ThemeProvider is initializing
const fallbackColors = {
  primary: "#2563eb",
  background: "#ffffff",
  surface: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  subtext: "#64748b",
  border: "#e2e8f0",
  notification: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
};

export function useTheme() {
  const context = useContext(ThemeContext);

  // Safe fallback to 'light' if context is temporarily undefined
  const mode: ThemeMode = context?.mode ?? "light";
  const themeColors = colors && colors[mode] ? colors[mode] : fallbackColors;

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