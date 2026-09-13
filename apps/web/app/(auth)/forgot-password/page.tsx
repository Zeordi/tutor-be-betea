"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${api}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Request failed");
      }
      sessionStorage.setItem("resetPhone", phoneNumber.trim());
      router.push(
        `/reset-password?phone=${encodeURIComponent(phoneNumber.trim())}`,
      );
    } catch (err: any) {
      setMessage(err.message || "Could not start reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
      >
        <h1 className="text-xl font-extrabold">Forgot password</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          We will send an OTP to your phone via AfroMessage.
        </p>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="0912345678"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
        >
          {loading ? "Sending…" : "Send reset code"}
        </button>
        {message && <p className="text-sm text-[var(--warning)]">{message}</p>}
        <Link href="/login" className="block text-center text-sm text-[var(--primary)]">
          Back to login
        </Link>
      </form>
    </main>
  );
}