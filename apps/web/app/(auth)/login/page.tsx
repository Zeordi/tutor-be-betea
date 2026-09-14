"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

const LANGS = ["EN", "አማ", "ORO", "ትግ"] as const;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const redirectByRole = (role?: string) => {
    if (role === "TEACHER") router.push("/teacher");
    else router.push("/parent");
  };

  const sendPhoneOtp = async () => {
    const res = await fetch(`${API_URL}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message || "Failed to send OTP");
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (password.length < 6) {
        setMessage("Password min 6 characters");
        return;
      }
      if (tab === "email") {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as any).message || "Login failed");
        setSession((data as any).accessToken, (data as any).user?.role);
        redirectByRole((data as any).user?.role);
        return;
      }
      if (!phoneNumber.trim()) {
        setMessage("Enter phone number");
        return;
      }
      await sendPhoneOtp();
      setStep("otp");
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setMessage(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (otp.trim().length !== 6) throw new Error("Enter 6-digit code");
      const verifyRes = await fetch(`${API_URL}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          code: otp.trim(),
        }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error(
          (verifyData as any).message || "Invalid or expired OTP",
        );
      }
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          password,
          verificationToken: (verifyData as any).verificationToken,
        }),
      });
      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) {
        throw new Error((loginData as any).message || "Login failed");
      }
      setSession(
        (loginData as any).accessToken,
        (loginData as any).user?.role,
      );
      redirectByRole((loginData as any).user?.role);
    } catch (err: any) {
      setMessage(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F0FDFA] dark:bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                lang === l
                  ? "bg-[#008779] text-white"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg dark:bg-[var(--card)]">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Sign in
          </h1>

          {step === "credentials" && (
            <>
              <div className="mb-4 flex rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab("phone")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                    tab === "phone"
                      ? "bg-[#008779] text-white"
                      : "text-slate-500"
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setTab("email")}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                    tab === "email"
                      ? "bg-[#008779] text-white"
                      : "text-slate-500"
                  }`}
                >
                  Email
                </button>
              </div>
              <form onSubmit={handleCredentials} className="space-y-3">
                {tab === "phone" ? (
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone (+251… or 09…)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (Gmail, etc.)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  />
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {loading
                    ? "Please wait…"
                    : tab === "phone"
                      ? "Continue — Send OTP"
                      : "Sign in with email"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpLogin} className="space-y-3">
              <p className="text-sm text-slate-500">
                Enter OTP sent to {phoneNumber}
              </p>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center tracking-[0.3em] font-semibold"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white"
              >
                {loading ? "Verifying…" : "Verify & sign in"}
              </button>
              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await sendPhoneOtp();
                    setCountdown(60);
                  } catch (err: any) {
                    setMessage(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full text-sm font-semibold text-[#008779]"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full text-xs text-slate-500"
              >
                ← Back
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
          )}

          <div className="mt-6 space-y-2 text-center text-sm">
            <Link href="/forgot-password" className="block text-[#008779]">
              Forgot password?
            </Link>
            <Link href="/register" className="block text-slate-500">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}