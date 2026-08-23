import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: "PARENT" | "TEACHER" | "SUPPORT_AGENT" | "SUPER_ADMIN";
  status?: string;
  avatarUrl?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    id: "demo-user-id",
    fullName: "Abebe Bikila",
    phoneNumber: "0911223344",
    role: "PARENT",
  });
  const [token, setToken] = useState<string | null>("demo-token");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await SecureStore.getItemAsync("auth_token");
      const storedUser = await SecureStore.getItemAsync("auth_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load auth", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(newToken: string, newUser: User) {
    setToken(newToken);
    setUser(newUser);
    await SecureStore.setItemAsync("auth_token", newToken);
    await SecureStore.setItemAsync("auth_user", JSON.stringify(newUser));
  }

  async function logout() {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("auth_user");
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