import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";
  status?: string;
  avatarUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync("auth_token");
      const storedUser = await SecureStore.getItemAsync("auth_user");
      if (storedToken && storedUser) {
        setTokenState(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(newToken: string, newUser: User, newRefreshToken?: string) {
    setTokenState(newToken);
    setUser(newUser);
    await SecureStore.setItemAsync("auth_token", newToken);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(newUser));
    if (newRefreshToken) {
      await SecureStore.setItemAsync("refresh_token", newRefreshToken);
    }
  }

  async function logout() {
    setTokenState(null);
    setUser(null);
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      if (token) {
        await fetch(API_URL + "/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // ignore logout API errors
    } finally {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("auth_user");
      await SecureStore.deleteItemAsync("refresh_token");
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };
}

export default useAuth;