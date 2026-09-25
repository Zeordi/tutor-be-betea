"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";
import { getApiUrl, paths } from "@/lib/api";
import { useTheme } from "@tutor/ui";

const LANGS = ["EN", "አማ"] as const;
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToEscrow, setAgreedToEscrow] = useState(false);
  const strength = passwordStrength(password);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const sendOtp = async () => {
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

  const handleDetailsContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || password.length < 6) {
        throw new Error("Name, phone, and password (min 6) are required.");
      }
      if (!agreedToTerms) {
        throw new Error("Please accept the Terms and Privacy Policy.");
      }
      if (!agreedToEscrow) {
        throw new Error("Please accept the Escrow Agreement to continue.");
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

      const registerRes = await fetch(getApiUrl() + paths.authRegister, {
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
    <div className="w-full">
      {/* Mobile brand header */}
      <div className="md:hidden mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-teal-300 text-lg">
          🎓
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white">TUTOR BE BETEA</p>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">ቱቶር በ ቤቴ</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Step {step} of 3 —{" "}
            {step === 1 ? "Role" : step === 2 ? "Details" : "Verify phone"}
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

      <div className="mb-6 flex gap-1">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? "bg-[#008779]" : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-base font-bold text-slate-900 dark:text-white">Welcome to Tutor Be Betea</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">How would you like to join?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("PARENT")}
              className={`rounded-2xl border px-3 py-4 text-left transition ${
                role === "PARENT"
                  ? "border-[#008779] bg-teal-50 dark:bg-teal-900/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="text-2xl mb-2">👨‍👩‍👧</div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Parent / Guardian
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Find tutors for my child
                  </p>
                </div>
                {role === "PARENT" && (
                  <span className="text-[#008779] text-lg">✓</span>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`rounded-2xl border px-3 py-4 text-left transition ${
                role === "TEACHER"
                  ? "border-[#008779] bg-teal-50 dark:bg-teal-900/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="text-2xl mb-2">🧑‍🏫</div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Tutor / Teacher
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Offer tutoring services
                  </p>
                </div>
                {role === "TEACHER" && (
                  <span className="text-[#008779] text-lg">✓</span>
                )}
              </div>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white hover:bg-[#006b5f]"
          >
            Continue as {role === "PARENT" ? "Parent" : "Tutor"} →
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleDetailsContinue} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                First Name *
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Last Name *
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Phone *
          </label>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <span className="px-3 py-3 text-sm text-slate-500 border-r border-slate-200 dark:border-slate-700 dark:text-slate-300">
              +251
            </span>
            <input
              value={phoneNumber.replace(/^\+?251/, "")}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "");
                setPhoneNumber(d ? `+251${d.replace(/^0/, "")}` : "");
              }}
              placeholder="7xxxxxxxx"
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none dark:text-white"
            />
          </div>

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < strength.score ? strength.color : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {password ? strength.label : ""}
            </span>
          </div>

          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Location <span className="text-slate-400">(optional)</span>
          </label>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bole, Addis Ababa"
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none dark:text-white"
            />
            <button
              type="button"
              className="px-3 py-3 text-xs font-semibold text-[#008779]"
            >
              Auto-detect
            </button>
          </div>

          {role === "TEACHER" && (
            <>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                Primary Subject <span className="text-slate-400">(optional)</span>
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathematics, Physics, ..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </>
          )}

          <label className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-[#008779]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-[#008779]">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreedToEscrow}
              onChange={(e) => setAgreedToEscrow(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I agree to the{" "}
              <Link href="/privacy" className="font-semibold text-[#008779]">
                Escrow Agreement
              </Link>{" "}
              and payment protection terms.
            </span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white hover:bg-[#006b5f] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Create Account — Verify Phone →"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-[#112240]">
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Verify Your Phone
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold">{phoneNumber.replace(/^\+?251/, "***")}</span>
              </p>
              <p className="text-xs text-slate-400">
                Telebirr OTP may apply depending on your carrier.
              </p>
            </div>

            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center tracking-[0.3em] text-2xl font-extrabold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                Expires in{" "}
                <span className="font-semibold">{countdown > 0 ? `${countdown}s` : "soon"}</span>
              </span>
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
                className="font-semibold text-[#008779]"
              >
                Resend SMS
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#008779] py-3 text-sm font-bold text-white hover:bg-[#006b5f] disabled:opacity-60"
            >
              {loading ? "Creating…" : "Verify & Create account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full text-xs text-slate-500 dark:text-slate-400"
            >
              ← Change phone number
            </button>
          </form>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
      )}

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-[#008779]">
          Sign in
        </Link>
      </p>
    </div>
  );
}