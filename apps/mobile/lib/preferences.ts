import AsyncStorage from "@react-native-async-storage/async-storage";

const BIOMETRIC_KEY = "tbb_biometric_enabled";

export async function getBiometricEnabled(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(BIOMETRIC_KEY);
    return v === "true";
  } catch {
    return false;
  }
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(BIOMETRIC_KEY, enabled ? "true" : "false");
}