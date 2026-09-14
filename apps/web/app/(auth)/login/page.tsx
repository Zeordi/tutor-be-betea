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
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
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
    else if (
      role === "SUPER_ADMIN" ||
      role === "SUPPORT_AGENT" ||
      role === "FINANCE" ||
      role === "VERIFICATION_OFFICER"
    ) {
      router.push("/login");
    } else router.push("/parent");
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

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        return;
      }

      // Email + password (no Google idToken)
      if (tab === "email") {
        if (!email.trim()) {
          setMessage("Enter your email.");
          return;
        }
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data as any).message || "Login failed");
        }
        if ((data as any).accessToken) {
          setSession(
            (data as any).accessToken,
            (data as any).user?.role,
          );
          redirectByRole((data as any).user?.role);
          return;
        }
        throw new Error("No access token returned");
      }

      // Phone + password → SMS OTP → login
      if (!phoneNumber.trim()) {
        setMessage("Enter your phone number.");
        return;
      }
      await sendPhoneOtp();
      setStep("otp");
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setMessage("OTP sent to your phone. Use the newest code only.");
    } catch (err: any) {
      setMessage(err.message || "Could not continue");
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
      if (code.length !== 6) {
        setMessage("Enter the 6-digit code.");
        return;
      }

      const verifyRes = await fetch(`${API_URL}/auth/otp/verify`, {
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

      const verificationToken = (verifyData as any).verificationToken;
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          password,
          verificationToken,
        }),
      });
      const loginData = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) {
        throw new Error((loginData as any).message || "Login failed");
      }

      if ((loginData as any).accessToken) {
        setSession(
          (loginData as any).accessToken,
          (loginData as any).user?.role,
        );
        redirectByRole((loginData as any).user?.role);
        return;
      }
      throw new Error("No access token returned");
    } catch (err: any) {
      setMessage(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                lang === l
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            Sign in
          </h1>

          {step === "credentials" && (
            <>
              <div className="mb-4 flex rounded-full bg-[var(--muted)] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab("phone");
                    setMessage("");
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                    tab === "phone"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("email");
                    setMessage("");
                  }}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold ${
                    tab === "email"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)]"
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
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                    autoComplete="tel"
                  />
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (Gmail, etc.)"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                    autoComplete="email"
                  />
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
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
                Enter the 6-digit code sent to {phoneNumber}
              </p>
              <div className="flex justify-between gap-2">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    maxLength={1}
                    className="h-12 w-10 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center text-lg font-bold"
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
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
                    setMessage("OTP resent — use the newest code only.");
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
                className="w-full text-sm text-[var(--muted-foreground)]"
              >
                ← Back
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
          )}

          <div className="mt-6 space-y-2 text-center text-sm">
            <Link href="/forgot-password" className="block text-[var(--primary)]">
              Forgot password?
            </Link>
            <Link
              href="/register"
              className="block text-[var(--muted-foreground)]"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}