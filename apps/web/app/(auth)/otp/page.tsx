"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "";
  const password = searchParams.get("password") || "";
  const fullName = searchParams.get("fullName") || "";
  const role = searchParams.get("role") || "PARENT";
  const mode = searchParams.get("mode") || "login";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const verifyRes = await fetch(`${api}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: otp.trim() }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid or expired OTP");
      }
      const verifyData = await verifyRes.json();

      if (mode === "register") {
        const registerRes = await fetch(`${api}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            fullName,
            role,
            password: password || undefined,
            verificationToken: verifyData.verificationToken,
          }),
        });
        if (!registerRes.ok) {
          const err = await registerRes.json().catch(() => ({}));
          throw new Error(err.message || "Registration failed");
        }
        const data = await registerRes.json();
        if (data.accessToken) setToken(data.accessToken);
        router.push(role === "TEACHER" ? "/teacher" : "/parent");
      } else {
        const loginRes = await fetch(`${api}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            password,
            verificationToken: verifyData.verificationToken,
          }),
        });
        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => ({}));
          throw new Error(err.message || "Login failed");
        }
        const data = await loginRes.json();
        if (data.accessToken) setToken(data.accessToken);
        router.push(data.user?.role === "TEACHER" ? "/teacher" : "/parent");
      }
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-8">
        <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/40 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
          💬
        </div>
        <h1 className="text-xl font-extrabold text-center text-[var(--foreground)] mb-1">
          Verify Your Phone
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] text-center mb-6">
          Code sent to <strong>{phoneNumber || "your phone"}</strong>
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full rounded-xl border-2 border-teal-500 px-4 py-3 tracking-[0.4em] text-center text-lg font-extrabold outline-none bg-[var(--background)]"
          />
          {message && (
            <p className="text-sm text-red-500 text-center">{message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Verify & Continue →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading...
        </main>
      }
    >
      <OtpForm />
    </Suspense>
  );
}