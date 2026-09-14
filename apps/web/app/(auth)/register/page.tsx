"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

const LANGS = ["EN", "አማ", "ORO", "ትግ"] as const;
type Role = "PARENT" | "TEACHER";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<Role>("PARENT");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

  const strength = passwordStrength(password);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

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

  const handleDetailsContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!fullName.trim() || !phoneNumber.trim() || password.length < 6) {
        throw new Error("Name, phone, and password (min 6) are required.");
      }
      await sendOtp();
      setStep(3);
      setCountdown(60);
      setOtp("");
      setMessage("OTP sent. Use only the newest code from SMS.");
    } catch (err: any) {
      setMessage(err.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (otp.trim().length !== 6) {
        throw new Error("Enter the 6-digit code.");
      }

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

      const verificationToken = (verifyData as any).verificationToken;
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          password,
          role,
          verificationToken,
        }),
      });
      const data = await registerRes.json().catch(() => ({}));
      if (!registerRes.ok) {
        throw new Error((data as any).message || "Registration failed");
      }

      if ((data as any).accessToken) {
        setSession((data as any).accessToken, (data as any).user?.role);
        router.push(role === "TEACHER" ? "/teacher" : "/parent");
        return;
      }
      throw new Error("Account created but no token returned — try Sign in.");
    } catch (err: any) {
      setMessage(err.message || "Could not create account");
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
          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Step {step} of 3 —{" "}
            {step === 1 ? "Role" : step === 2 ? "Details" : "Verify phone"}
          </p>

          <div className="mb-6 flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full ${
                  s <= step ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--muted-foreground)]">
                I am signing up as
              </p>
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                  role === "PARENT"
                    ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                    : "border-[var(--border)]"
                }`}
              >
                Parent — find tutors for my child
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                  role === "TEACHER"
                    ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                    : "border-[var(--border)]"
                }`}
              >
                Teacher — offer tutoring
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleDetailsContinue} className="space-y-3">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name *"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
              />
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone * (+251… or 09…)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email optional (Gmail, etc.)"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password *"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
              />
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < strength.score ? strength.color : "bg-[var(--border)]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {password ? strength.label : ""}
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                By continuing you agree to Terms, Privacy, and Escrow Agreement.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {loading ? "Sending OTP…" : "Next — Verify phone →"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-3">
              <p className="text-sm text-[var(--muted-foreground)]">
                Enter OTP sent to {phoneNumber}
              </p>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm tracking-widest"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
              >
                {loading ? "Creating…" : "Verify & Create account"}
              </button>
              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await sendOtp();
                    setCountdown(60);
                    setMessage("New code sent — use only this latest code.");
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
                onClick={() => setStep(2)}
                className="w-full text-xs text-[var(--muted-foreground)]"
              >
                ← Back
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
          )}

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
            Already a member?{" "}
            <Link href="/login" className="text-teal-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}