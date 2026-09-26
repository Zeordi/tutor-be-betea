"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";
import { getApiUrl, paths } from "@/lib/api";
import { useTheme } from "@tutor/ui";
import { MobileAuthHeader } from "../MobileAuthHeader";

const LANGS = ["EN", "አማ"] as const;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { mode, toggleTheme } = useTheme();
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

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

  const setDigit = (i: number, v: string) => {
    const next = [...otpDigits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtpDigits(next);
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
      setOtpDigits(["", "", "", "", "", ""]);
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
      const code = otpDigits.join("");
      if (code.length !== 6) throw new Error("Enter 6-digit code");
      const verifyRes = await fetch(getApiUrl() + paths.authOtpVerify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          code,
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
      <MobileAuthHeader title="Sign in" subtitle="Welcome back — continue to your account" />

      <div className="mb-6 hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Sign in
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Welcome back — continue to your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
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
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm"
            aria-label="Toggle theme"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {step === "credentials" && (
        <>
          <div className="mb-4 flex rounded-full bg-[var(--muted)] p-1">
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                tab === "phone"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              Phone Number
            </button>
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                tab === "email"
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)]"
              }`}
            >
              Email / Gmail
            </button>
          </div>
          <form onSubmit={handleCredentials} className="space-y-3">
            {tab === "phone" ? (
              <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] overflow-hidden">
                <span className="px-3 py-3 text-sm text-[var(--muted-foreground)] border-r border-[var(--border)]">
                  +251
                </span>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="912345678"
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-[var(--foreground)]"
                />
              </div>
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
            )}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Visual-only payment/bio tiles */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: "💳", label: "Telebirr" },
                { icon: "🏦", label: "CBE Birr" },
                { icon: "🔐", label: "Biometric" },
              ].map((tile) => (
                <button
                  key={tile.label}
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] opacity-75"
                >
                  <span>{tile.icon}</span>
                  {tile.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border)]"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[var(--primary)]">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
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
          <p className="text-sm text-[var(--muted-foreground)]">
            Enter OTP sent to {phoneNumber}
          </p>
          <div className="flex items-center justify-center gap-2">
            {otpDigits.map((d, i) => (
              <input
                key={i}
                data-otp-index={i}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !d && i > 0) {
                    const prev = document.querySelector<HTMLInputElement>(`input[data-otp-index="${i - 1}"]`);
                    prev?.focus();
                  }
                }}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (input.value && i < otpDigits.length - 1) {
                    const next = document.querySelector<HTMLInputElement>(`input[data-otp-index="${i + 1}"]`);
                    next?.focus();
                  }
                }}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-10 h-12 md:w-12 md:h-14 shrink-0 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] text-center text-base md:text-lg font-extrabold outline-none transition focus:border-[var(--primary)]"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
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
                setOtpDigits(["", "", "", "", "", ""]);
              } catch (err: any) {
                setMessage(err.message);
              } finally {
                setLoading(false);
              }
            }}
            className="w-full text-sm font-semibold text-[var(--primary)]"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
          <button
            type="button"
            onClick={() => setStep("credentials")}
            className="w-full text-xs text-[var(--muted-foreground)]"
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
        <p className="text-xs text-[var(--muted-foreground)]">
          Need help?{" "}
          <Link href="/help" className="text-[var(--primary)]">Contact support</Link>
        </p>
      </div>
    </div>
  );
}