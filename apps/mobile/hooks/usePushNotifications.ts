import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { getToken } from "@/lib/api";
import { useRouter } from "expo-router";

let Notifications: typeof import("expo-notifications") | null = null;

if (Platform.OS !== "web") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require("expo-notifications");
  Notifications?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web" || !Notifications) {
      return;
    }

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        sendTokenToBackend(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔔 Foreground Notification Received:", notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.contractId) {
        router.push(`/(parent)/contract/${data.contractId}`);
      } else if (data?.roomId) {
        router.push(`/(shared)/chat/${data.roomId}`);
      }
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken };
}

async function sendTokenToBackend(pushToken: string) {
  try {
    const token = await getToken();
    if (!token) return;

    await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000"}/notifications/push-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pushToken }),
    });
  } catch (e) {
    console.warn("Failed to register push token with backend", e);
  }
}

async function registerForPushNotificationsAsync() {
  if (!Notifications || !Device.isDevice) {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#0F766E",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}