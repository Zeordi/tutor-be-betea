"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

const LANGS = ["EN", "አማ", "ORO", "ትግ"] as const;

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "TEACHER">("PARENT");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  const [countdown, setCountdown] = useState(0);

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const strength = passwordStrength(password);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (!fullName.trim() || !phoneNumber.trim() || password.length < 6) {
        setMessage("Fill name, phone, and password (min 6 characters).");
        return;
      }
      const res = await fetch(`${api}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send OTP");
      }
      setStep(3);
      setCountdown(60);
      setMessage("OTP sent");
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
      const verifyRes = await fetch(`${api}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), code: otp.trim() }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid OTP");
      }
      const verifyData = await verifyRes.json();

      const registerRes = await fetch(`${api}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
          phoneNumber: phoneNumber.trim(),
          password,
          role,
          verificationToken: verifyData.verificationToken,
        }),
      });
      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => ({}));
        throw new Error(err.message || "Registration failed");
      }
      const data = await registerRes.json();
      if (data.accessToken) setToken(data.accessToken);
      router.push(role === "TEACHER" ? "/teacher" : "/parent");
    } catch (err: any) {
      setMessage(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[var(--background)]">
      <aside className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 bg-gradient-to-br from-teal-800 via-teal-900 to-blue-950 p-10 text-white">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <p className="text-[10px] text-teal-300 font-extrabold tracking-widest uppercase">
                Tutor Be
              </p>
              <p className="text-xl font-extrabold">BETEA</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-3">
            Join Ethiopia&apos;s trusted tutoring network
          </h2>
          <p className="text-teal-200/80 text-sm">
            Parents and verified tutors · Escrow · Safety first
          </p>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-10 bg-green-500 rounded-full" />
          <div className="h-1 w-10 bg-yellow-400 rounded-full" />
          <div className="h-1 w-10 bg-red-500 rounded-full" />
        </div>
      </aside>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-extrabold text-[var(--foreground)]">Create Account</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Step {step} of 3 — {["Role", "Details", "Verify"][step - 1]}
              </p>
            </div>
            <div className="flex gap-1">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    lang === l ? "bg-teal-600 text-white" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full ${n <= step ? "bg-teal-600" : "bg-[var(--muted)]"}`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3">
              {(["PARENT", "TEACHER"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition ${
                    role === r
                      ? "border-teal-600 bg-teal-50 dark:bg-teal-900/20"
                      : "border-[var(--border)] bg-[var(--card)]"
                  }`}
                >
                  <span className="text-2xl">{r === "PARENT" ? "👨‍👩‍👧" : "🧑‍🏫"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[var(--foreground)]">
                      {r === "PARENT" ? "Parent / Guardian" : "Tutor / Teacher"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {r === "PARENT"
                        ? "Find verified tutors for your children"
                        : "Earn teaching students near you"}
                    </p>
                  </div>
                  {role === r && <span className="text-teal-600 font-bold">✓</span>}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm"
              >
                Continue as {role === "PARENT" ? "Parent" : "Tutor"} →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Full name *
                </label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Phone *
                </label>
                <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)]">
                  <span className="text-sm font-extrabold text-teal-600">+251</span>
                  <div className="w-px h-5 bg-[var(--border)]" />
                  <input
                    required
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="91 234 5678"
                    className="bg-transparent text-sm flex-1 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Password *
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none"
                />
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            strength.score >= i ? strength.color : "bg-[var(--muted)]"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)]">
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                By continuing you agree to Terms, Privacy, and Escrow Agreement.
              </p>
              {message && <p className="text-xs text-red-500 text-center">{message}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--muted-foreground)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSendOtp}
                  className="flex-1 bg-teal-600 text-white font-bold py-3 rounded-xl text-sm"
                >
                  {loading ? "Sending OTP..." : "Next — Verify Phone →"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                Enter OTP sent to <strong>{phoneNumber}</strong>
              </p>
              <input
                required
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border-2 border-teal-500 px-4 py-3 text-center tracking-[0.4em] text-lg font-extrabold outline-none bg-[var(--card)]"
              />
              <p className="text-center text-xs text-[var(--muted-foreground)]">
                {countdown > 0 ? `Resend in ${countdown}s` : "You can request a new code"}
              </p>
              {message && <p className="text-xs text-red-500 text-center">{message}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm"
              >
                {loading ? "Creating..." : "Verify & Create account"}
              </button>
              <button
                type="button"
                className="w-full text-xs text-[var(--muted-foreground)]"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
            </form>
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