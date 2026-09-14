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
  const [googleIdToken, setGoogleIdToken] = useState("");
  const [tab, setTab] = useState<"phone" | "google">("phone");
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
        throw new Error("Name, phone, and password (min 6) are required");
      }
      await sendOtp();
      setStep(3);
      setCountdown(60);
      setMessage("OTP sent to your phone");
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
        throw new Error((verifyData as any).message || "Invalid OTP");
      }

      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim() || undefined,
          phoneNumber: phoneNumber.trim(),
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
        setSession((data as any).accessToken, (data as any).user?.role || role);
      }
      router.push(role === "TEACHER" ? "/teacher" : "/parent");
    } catch (err: any) {
      setMessage(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!googleIdToken.trim()) {
        throw new Error("Paste Google idToken (or wire GIS button)");
      }
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: googleIdToken.trim(),
          role,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Google signup failed");
      }
      if ((data as any).accessToken) {
        setSession((data as any).accessToken, (data as any).user?.role || role);
      }
      router.push(
        ((data as any).user?.role || role) === "TEACHER"
          ? "/teacher"
          : "/parent",
      );
    } catch (err: any) {
      setMessage(err.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[var(--background)]">
      <aside className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 bg-gradient-to-br from-teal-800 via-teal-900 to-blue-950 p-10 text-white">
        <div>
          <p className="text-[10px] text-teal-300 font-extrabold tracking-widest uppercase">
            Tutor Be Betea
          </p>
          <h2 className="text-3xl font-extrabold mt-6 mb-3">
            Join Ethiopia&apos;s trusted tutoring network
          </h2>
          <p className="text-teal-200/80 text-sm">
            Parents and verified tutors · Escrow · Safety first
          </p>
        </div>
        <p className="text-xs text-teal-200/60">Step {step} of 3</p>
      </aside>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="mb-4 flex justify-end gap-2">
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

          <h1 className="text-2xl font-extrabold mb-2">Create account</h1>

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

          {tab === "google" ? (
            <form onSubmit={handleGoogleRegister} className="space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                First-time Google signup requires role.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["PARENT", "TEACHER"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-xl border p-3 text-sm font-bold ${
                      role === r
                        ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950"
                        : "border-[var(--border)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
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
                className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
              >
                {loading ? "Creating…" : "Continue with Google"}
              </button>
            </form>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold">I am a…</p>
                  {(["PARENT", "TEACHER"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`w-full rounded-xl border p-4 text-left font-bold ${
                        role === r
                          ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {r === "PARENT" ? "👨‍👩‍👧 Parent" : "📚 Teacher"}
                    </button>
                  ))}
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
                    placeholder="Full name"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                  />
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone 09… / 07… / +251"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
                  />
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`h-1.5 flex-1 rounded ${strength.color}`} />
                    <span>{strength.label}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
                  >
                    {loading ? "Sending OTP…" : "Send OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-xs text-[var(--muted-foreground)]"
                  >
                    ← Back
                  </button>
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
            </>
          )}

          {message && (
            <p className="mt-4 text-center text-sm text-[var(--warning)]">
              {message}
            </p>
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