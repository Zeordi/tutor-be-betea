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
  const [tab, setTab] = useState<"phone" | "google">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  const [countdown, setCountdown] = useState(0);
  const [googleIdToken, setGoogleIdToken] = useState("");

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

  const sendOtp = async () => {
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
      if (tab === "google") {
        setMessage("Paste a Google ID token below, or wire Google GIS button.");
        return;
      }
      if (!phoneNumber.trim() || password.length < 6) {
        setMessage("Enter a valid phone and password (min 6 characters).");
        return;
      }
      await sendOtp();
      setStep("otp");
      setCountdown(60);
      setMessage("OTP sent to your phone.");
    } catch (err: any) {
      setMessage(err.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const code = otpDigits.join("");
      if (code.length !== 6) {
        setMessage("Enter the 6-digit code");
        return;
      }

      const verifyRes = await fetch(`${API_URL}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), code }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error((verifyData as any).message || "Invalid OTP");
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
      const data = await loginRes.json().catch(() => ({}));
      if (!loginRes.ok) {
        throw new Error((data as any).message || "Login failed");
      }

      if ((data as any).accessToken) {
        setSession((data as any).accessToken, (data as any).user?.role);
        redirectByRole((data as any).user?.role);
      }
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!googleIdToken.trim()) {
        setMessage("Google ID token is required.");
        return;
      }
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: googleIdToken.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Google sign-in failed");
      }
      if ((data as any).accessToken) {
        setSession((data as any).accessToken, (data as any).user?.role);
        redirectByRole((data as any).user?.role);
      }
    } catch (err: any) {
      setMessage(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const setDigit = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = v;
    setOtpDigits(next);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-3xl font-extrabold text-[var(--primary)]">
            Tutor Be Betea
          </div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Sign in with phone + OTP or Google
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-lg px-2 py-1 text-xs font-bold ${
                  lang === l
                    ? "bg-[var(--primary)] text-white"
                    : "border border-[var(--border)] text-[var(--muted-foreground)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          {step === "credentials" && (
            <>
              <div className="mb-4 flex rounded-xl border border-[var(--border)] p-1">
                <button
                  type="button"
                  onClick={() => setTab("phone")}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold ${
                    tab === "phone"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setTab("google")}
                  className={`flex-1 rounded-lg py-2 text-sm font-bold ${
                    tab === "google"
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  Google / Gmail
                </button>
              </div>

              {tab === "phone" ? (
                <form onSubmit={handleCredentials} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Phone (09… / 07… / +251)
                    </label>
                    <input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                      placeholder="0912345678"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {loading ? "Sending OTP…" : "Continue with OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleGoogleLogin} className="space-y-4">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Uses POST /auth/google. Set GOOGLE_CLIENT_ID on the API
                    (Render).
                  </p>
                  <textarea
                    value={googleIdToken}
                    onChange={(e) => setGoogleIdToken(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                    placeholder="Google idToken"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
                  >
                    {loading ? "Signing in…" : "Continue with Google"}
                  </button>
                </form>
              )}
            </>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
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
                    await sendOtp();
                    setCountdown(60);
                    setMessage("OTP resent");
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
            <p className="mt-4 text-center text-sm text-[var(--warning)]">
              {message}
            </p>
          )}

          <div className="mt-6 space-y-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="block text-[var(--primary)]"
            >
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