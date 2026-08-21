import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeProvider";
import { colors, spacing, radius, typography, type ThemeMode } from "@tutor/ui";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { mode, toggleTheme, setMode } = context;
  const themeColors = colors[mode];

  return {
    mode,
    isDark: mode === "dark",
    colors: themeColors,
    spacing,
    radius,
    typography,
    toggleTheme,
    setMode,
  };
}

export type { ThemeMode };
