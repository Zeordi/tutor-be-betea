"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@tutor/ui";
import { MobileAuthHeader } from "../MobileAuthHeader";
import { getApiUrl, paths } from "@/lib/api";

type ResetStep = "otp" | "newPassword";

const LANGS = ["EN", "አማ"] as const;

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Phone" },
    { num: 2, label: "Verify OTP" },
    { num: 3, label: "New Password" },
  ];

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border-2 text-xs md:text-sm font-bold transition ${
                  currentStep > step.num
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : currentStep === step.num
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                }`}
              >
                {currentStep > step.num ? "✓" : step.num}
              </div>
              <span
                className={`mt-1 text-[10px] md:text-xs font-medium ${
                  currentStep >= step.num
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-1 md:mx-2 h-0.5 flex-1 ${
                  currentStep > step.num ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { mode, toggleTheme } = useTheme();

  const initialPhone = useMemo(
    () =>
      params.get("phone") ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("resetPhone") || ""
        : ""),
    [params],
  );

  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetStep, setResetStep] = useState<ResetStep>("otp");
  const [countdown, setCountdown] = useState(0);
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Start countdown when phone is available
  useEffect(() => {
    if (initialPhone && countdown === 0) {
      setCountdown(60);
    }
  }, [initialPhone, countdown]);

  const strength =
    newPassword.length >= 10
      ? "Strong"
      : newPassword.length >= 6
        ? "Fair"
        : "Weak";

  const strengthColor =
    strength === "Strong"
      ? "text-emerald-600"
      : strength === "Fair"
        ? "text-amber-600"
        : "text-red-500";

  const passwordsMatch = confirm.length > 0 && newPassword === confirm;

  const setDigit = (i: number, v: string) => {
    const next = [...otpDigits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtpDigits(next);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const code = otpDigits.join("");
      if (code.length !== 6) throw new Error("Enter 6-digit OTP");

      const verifyRes = await fetch(getApiUrl() + paths.authOtpVerify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), code }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error((verifyData as any).message || "Invalid OTP");
      }

      sessionStorage.setItem("verificationToken", (verifyData as any).verificationToken);
      setResetStep("newPassword");
    } catch (err: any) {
      setMessage(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (newPassword !== confirm) throw new Error("Passwords do not match");
      if (newPassword.length < 6) throw new Error("Password min 6 characters");

      const verificationToken =
        typeof window !== "undefined"
          ? sessionStorage.getItem("verificationToken") || ""
          : "";

      if (!verificationToken) {
        throw new Error("Session expired. Please start over.");
      }

      const res = await fetch(getApiUrl() + paths.authPasswordReset, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          verificationToken,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Reset failed");
      }
      router.push("/login");
    } catch (err: any) {
      setMessage(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(getApiUrl() + paths.authPasswordForgot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Failed to resend");
      }
      setMessage("New code sent — use only the latest SMS.");
      setCountdown(60);
    } catch (err: any) {
      setMessage(err.message || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile header */}
      <div className="md:hidden">
        <MobileAuthHeader
          title={resetStep === "otp" ? "Verify OTP" : "New Password"}
          subtitle={
            resetStep === "otp"
              ? "Enter the 6-digit code sent to your phone"
              : "Set a new password for your account"
          }
        />
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex mb-8 items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--foreground)]">
            {resetStep === "otp" ? "Enter OTP" : "New Password"}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {resetStep === "otp"
              ? `Enter the 6-digit code sent to ${phoneNumber.replace(/^\+?251/, "***")}`
              : "Create a strong password for your account"}
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

      <Stepper currentStep={resetStep === "otp" ? 2 : 3} />

      {resetStep === "otp" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 md:space-y-5">
          <div>
            <label className="mb-1.5 block text-xs md:text-sm font-semibold text-[var(--foreground)]">
              6-Digit Code
            </label>
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

            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
              <span>
                Expires in{" "}
                <span className="font-semibold">
                  {countdown > 0 ? formatTime(countdown) : "expired"}
                </span>
              </span>
              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={resendOtp}
                className="font-semibold text-[var(--primary)] hover:underline disabled:opacity-60"
              >
                {countdown > 0 ? "Resend" : "Resend SMS"}
              </button>
            </div>
          </div>

          {message && (
            <p className="text-xs md:text-sm text-red-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--primary)] py-3 md:py-3.5 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {loading ? "Updating…" : "Set Password & Sign In →"}
          </button>

          <div className="space-y-2 text-center">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="block w-full text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
            >
              ← Change phone number
            </button>
            <Link
              href="/login"
              className="block text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)]"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}

      {resetStep === "newPassword" && (
        <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-5">
          <div>
            <label className="mb-1.5 block text-xs md:text-sm font-semibold text-[var(--foreground)]">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-3 md:px-4 py-2.5 md:py-3 text-sm text-[var(--foreground)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className={`mt-1 text-xs font-medium ${strengthColor}`}>
              Strength: {strength}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs md:text-sm font-semibold text-[var(--foreground)]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-3 md:px-4 py-2.5 md:py-3 text-sm text-[var(--foreground)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {confirm.length > 0 && (
              <p className={`mt-1 text-xs font-medium ${passwordsMatch ? "text-emerald-600" : "text-red-500"}`}>
                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-3 md:px-4 py-2.5 md:py-3">
            <span className="text-base md:text-lg">🔒</span>
            <p className="text-[11px] md:text-xs text-[var(--muted-foreground)]">
              Your password is protected with <span className="font-semibold text-[var(--foreground)]">AES-256</span> encryption.
            </p>
          </div>

          {message && (
            <p className="text-xs md:text-sm text-red-500">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[var(--primary)] py-3 md:py-3.5 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {loading ? "Updating…" : "Set Password & Sign In →"}
          </button>

          <Link
            href="/login"
            className="block text-center text-xs md:text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"
          >
            ← Back to Sign In
          </Link>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<p>Loading…</p>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
