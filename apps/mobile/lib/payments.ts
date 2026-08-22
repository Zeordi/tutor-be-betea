import { Linking, Alert } from "react-native";

/**
 * Open Telebirr payment
 * In production you will receive a paymentUrl from your backend
 */
export async function payWithTelebirr(paymentUrl: string) {
  try {
    const supported = await Linking.canOpenURL(paymentUrl);

    if (supported) {
      await Linking.openURL(paymentUrl);
    } else {
      // Fallback: open in browser
      await Linking.openURL(paymentUrl);
    }
  } catch (error) {
    Alert.alert("Payment Error", "Could not open Telebirr. Please try again.");
  }
}

/**
 * Example usage after creating a contract:
 * 
 * const res = await fetch("/payments/initiate", { ... });
 * const data = await res.json();
 * if (data.paymentUrl) {
 *   await payWithTelebirr(data.paymentUrl);
 * }
 */
