"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/lib/auth";
import { getApiUrl, paths } from "@/lib/api";
import { useTheme } from "@tutor/ui";
import { MobileAuthHeader } from "../MobileAuthHeader";

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
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
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

  const setDigit = (i: number, v: string) => {
    const next = [...otpDigits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtpDigits(next);
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
      setOtpDigits(["", "", "", "", "", ""]);
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
      const code = otpDigits.join("");
      if (code.length !== 6) throw new Error("Enter the 6-digit code.");

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
      <MobileAuthHeader title="Create account" subtitle={`Join 12,000+ families · Step ${step} of 3`} />

      <div className="mb-5 hidden md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
            Create account
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            Join 12,000+ families · Step {step} of 3
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

      <div className="mb-5 flex gap-1">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? "bg-[var(--primary)]" : "bg-[var(--border)]"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-base font-bold text-[var(--foreground)]">Welcome to Tutor Be Betea</p>
            <p className="text-sm text-[var(--muted-foreground)]">How would you like to join?</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("PARENT")}
              className={`rounded-2xl border px-3 py-4 text-left transition ${
                role === "PARENT"
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="text-2xl mb-2">👨‍👩‍👧</div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)]">
                    Parent / Guardian
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Find tutors for my child
                  </p>
                </div>
                {role === "PARENT" && (
                  <span className="text-[var(--primary)] text-lg">✓</span>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`rounded-2xl border px-3 py-4 text-left transition ${
                role === "TEACHER"
                  ? "border-[var(--primary)] bg-[var(--primary-light)]"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="text-2xl mb-2">🧑‍🏫</div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--foreground)]">
                    Tutor / Teacher
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    Offer tutoring services
                  </p>
                </div>
                {role === "TEACHER" && (
                  <span className="text-[var(--primary)] text-lg">✓</span>
                )}
              </div>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)]"
          >
            Continue as {role === "PARENT" ? "Parent" : "Tutor"} →
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleDetailsContinue} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)]">
                First Name *
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted-foreground)]">
                Last Name *
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
            </div>
          </div>

          <label className="block text-xs font-medium text-[var(--muted-foreground)]">
            Phone *
          </label>
          <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] overflow-hidden">
            <span className="px-3 py-3 text-sm text-[var(--muted-foreground)] border-r border-[var(--border)]">
              +251
            </span>
            <input
              value={phoneNumber.replace(/^\+?251/, "")}
              onChange={(e) => {
                const d = e.target.value.replace(/\D/g, "");
                setPhoneNumber(d ? `+251${d.replace(/^0/, "")}` : "");
              }}
              placeholder="7xxxxxxxx"
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-[var(--foreground)]"
            />
          </div>

          <label className="block text-xs font-medium text-[var(--muted-foreground)]">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@gmail.com"
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
          />

          <label className="block text-xs font-medium text-[var(--muted-foreground)]">
            Password *
          </label>
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

          <label className="block text-xs font-medium text-[var(--muted-foreground)]">
            Location <span className="text-[var(--muted-foreground)]">(optional)</span>
          </label>
          <div className="flex rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] overflow-hidden">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bole, Addis Ababa"
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none text-[var(--foreground)]"
            />
            <button
              type="button"
              className="px-3 py-3 text-xs font-semibold text-[var(--primary)]"
            >
              Auto-detect
            </button>
          </div>

          {role === "TEACHER" && (
            <>
              <label className="block text-xs font-medium text-[var(--muted-foreground)]">
                Primary Subject <span className="text-[var(--muted-foreground)]">(optional)</span>
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathematics, Physics, ..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)]"
              />
            </>
          )}

          <label className="flex items-start gap-2 text-[11px] text-[var(--muted-foreground)]">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--border)]"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-[var(--primary)]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-[var(--primary)]">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <label className="flex items-start gap-2 text-[11px] text-[var(--muted-foreground)]">
            <input
              type="checkbox"
              checked={agreedToEscrow}
              onChange={(e) => setAgreedToEscrow(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--border)]"
            />
            <span>
              I agree to the{" "}
              <Link href="/privacy" className="font-semibold text-[var(--primary)]">
                Escrow Agreement
              </Link>{" "}
              and payment protection terms.
            </span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Create Account — Verify Phone →"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  Verify Your Phone
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-semibold">{phoneNumber.replace(/^\+?251/, "***")}</span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Telebirr OTP may apply depending on your carrier.
                </p>
              </div>

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
                  <span className="font-semibold">{countdown > 0 ? `${countdown}s` : "expired"}</span>
                </span>
                <button
                  type="button"
                  disabled={countdown > 0 || loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await sendOtp();
                      setCountdown(60);
                      setOtpDigits(["", "", "", "", "", ""]);
                      setMessage("New code sent — use only the latest SMS.");
                    } catch (err: any) {
                      setMessage(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="font-semibold text-[var(--primary)]"
                >
                  Resend SMS
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[var(--primary)] py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
              >
                {loading ? "Creating…" : "Verify & Create account"}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full text-xs text-[var(--muted-foreground)]"
              >
                ← Change phone number
              </button>
            </form>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-amber-600">{message}</p>
      )}

      <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
        Already a member?{" "}
        <Link href="/login" className="font-semibold text-[var(--primary)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}