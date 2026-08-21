import React, { createContext, useCallback, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { colors, type ThemeMode } from "@tutor/ui";

type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    systemScheme === "dark" ? "dark" : "light"
  );

  // Optional: follow system theme automatically
  useEffect(() => {
    if (systemScheme) {
      setModeState(systemScheme === "dark" ? "dark" : "light");
    }
  }, [systemScheme]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
