"use client";

import { ThemeProvider } from "@tutor/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
