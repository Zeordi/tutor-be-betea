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
      setMessage("");
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
      if (otp.trim().length !== 6) throw new Error("Enter the 6-digit code.");

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

      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim() || undefined,
          password,
          role,
          verificationToken: (verifyData as any).verificationToken,
        }),
      });
      const data = await registerRes.json().catch(() => ({}));
      if (!registerRes.ok) {
        throw new Error((data as any).message || "Registration failed");
      }
      if ((data as any).accessToken) {
        setSession(
          (data as any).accessToken,
          (data as any).refreshToken,
          (data as any).user?.role,
        );
        router.push(role === "TEACHER" ? "/teacher" : "/parent");
        return;
      }
      throw new Error("No token — try Sign in");
    } catch (err: any) {
      setMessage(err.message || "Could not create account");
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

        <div className="rounded-3xl border border-slate-100 bg-white dark:bg-[var(--card)] p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create account
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            Step {step} of 3 —{" "}
            {step === 1 ? "Role" : step === 2 ? "Details" : "Verify phone"}
          </p>

          <div className="mb-6 flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  s <= step ? "bg-[#008779]" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Phone only — no Google idToken */}
          <div className="mb-4 flex rounded-full bg-slate-100 p-1">
            <div className="flex-1 rounded-full bg-[#008779] py-2 text-center text-sm font-semibold text-white">
              Phone
            </div>
            <div
              className="flex-1 rounded-full py-2 text-center text-sm font-medium text-slate-400"
              title="Email signup uses optional email on step 2; real Google OAuth later"
            >
              Email optional
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                  role === "PARENT"
                    ? "border-[#008779] bg-[#F0FDFA]"
                    : "border-slate-200"
                }`}
              >
                Parent — find tutors for my child
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                  role === "TEACHER"
                    ? "border-[#008779] bg-[#F0FDFA]"
                    : "border-slate-200"
                }`}
              >
                Teacher — offer tutoring
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleDetailsContinue} className="space-y-3">
              <label className="block text-xs font-medium text-slate-600">
                Full name *
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
              <label className="block text-xs font-medium text-slate-600">
                Phone *
              </label>
              <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                <span className="px-3 py-3 text-sm text-slate-500 border-r border-slate-200">
                  +251
                </span>
                <input
                  value={phoneNumber.replace(/^\+?251/, "")}
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, "");
                    setPhoneNumber(d ? `+251${d.replace(/^0/, "")}` : "");
                  }}
                  placeholder="7xxxxxxxx"
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
              <label className="block text-xs font-medium text-slate-600">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
              <label className="block text-xs font-medium text-slate-600">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              />
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < strength.score ? strength.color : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {password ? strength.label : ""}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                By continuing you agree to Terms, Privacy, and Escrow Agreement.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Next — Verify Phone →"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-3">
              <p className="text-sm text-slate-500">
                Enter OTP sent to {phoneNumber}
              </p>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm tracking-[0.3em] text-center font-semibold"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white"
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
                    setMessage("New code sent — use only the latest SMS.");
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
                onClick={() => setStep(2)}
                className="w-full text-xs text-slate-500"
              >
                ← Back
              </button>
            </form>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            Already a member?{" "}
            <Link href="/login" className="font-semibold text-[#008779]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}