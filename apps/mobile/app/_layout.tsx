import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import * as Sentry from "@sentry/react-native";

if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: false,
    debug: false,
  });
}

function RootLayoutNav() {
  const { isDark } = useTheme();
  usePushNotifications();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}