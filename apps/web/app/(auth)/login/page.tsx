"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";
import { getApiUrl, paths } from "@/lib/api";
import { useTheme } from "@tutor/ui";

const LANGS = ["EN", "አማ"] as const;

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
  const { mode, toggleTheme } = useTheme();

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
    const res = await fetch(getApiUrl() + paths.authOtpSend, {
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
        const res = await fetch(getApiUrl() + paths.authLogin, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error((data as any).message || "Login failed");
        setSession(
          (data as any).accessToken,
          (data as any).refreshToken,
          (data as any).user?.role,
        );
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
      const verifyRes = await fetch(getApiUrl() + paths.authOtpVerify, {
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
      const loginRes = await fetch(getApiUrl() + paths.authLogin, {
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
        (loginData as any).refreshToken,
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
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sign in
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back — continue to your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
          <div className="flex overflow-hidden rounded-md border border-[var(--border)] bg-[var(--muted)]">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-[11px] font-bold transition ${
                  lang === l
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--secondary)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {step === "credentials" && (
        <>
          <div className="mb-4 flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                tab === "phone"
                  ? "bg-[#008779] text-white"
                  : "text-slate-500 dark:text-slate-300"
              }`}
            >
              Phone Number
            </button>
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                tab === "email"
                  ? "bg-[#008779] text-white"
                  : "text-slate-500 dark:text-slate-300"
              }`}
            >
              Email / Gmail
            </button>
          </div>
          <form onSubmit={handleCredentials} className="space-y-3">
            {tab === "phone" ? (
              <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
                <span className="px-3 py-3 text-sm text-slate-500 border-r border-slate-200 dark:border-slate-700 dark:text-slate-300">
                  +251
                </span>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="912345678"
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none dark:text-white"
                />
              </div>
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#008779]">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white hover:bg-[#006b5f] disabled:opacity-60"
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
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter OTP sent to {phoneNumber}
          </p>
          <input
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="6-digit code"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center tracking-[0.3em] font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white hover:bg-[#006b5f] disabled:opacity-60"
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
            className="w-full text-xs text-slate-500 dark:text-slate-400"
          >
            ← Back
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
      )}

      <div className="mt-6 space-y-3 text-center text-sm">
        <Link
          href="/register"
          className="block rounded-2xl border border-[var(--primary)] py-2.5 text-sm font-bold text-[var(--primary)]"
        >
          Create free account
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Need help?{" "}
          <Link href="/help" className="text-[#008779]">Contact support</Link>
        </p>
      </div>
    </div>
  );
}