"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("EN");

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const redirectByRole = (role?: string) => {
    router.push(role === "TEACHER" ? "/teacher" : "/parent");
  };

  const sendOtp = async () => {
    const res = await fetch(`${api}/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to send OTP");
    }
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (tab !== "phone") {
        setMessage("Use phone number + OTP for secure sign-in.");
        return;
      }
      if (!phoneNumber.trim() || password.length < 6) {
        setMessage("Enter a valid phone and password (min 6 characters).");
        return;
      }
      await sendOtp();
      setStep("otp");
      setMessage("OTP sent to your phone");
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
      const verifyRes = await fetch(`${api}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          code: otp.trim(),
        }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid OTP");
      }
      const verifyData = await verifyRes.json();

      const loginRes = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          password,
          verificationToken: verifyData.verificationToken,
        }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.json().catch(() => ({}));
        throw new Error(err.message || "Login failed");
      }
      const data = await loginRes.json();
      if (data.accessToken) setToken(data.accessToken);
      redirectByRole(data.user?.role);
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[var(--background)]">
      {/* Left brand panel */}
      <aside className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 bg-gradient-to-br from-teal-800 via-teal-900 to-blue-950 p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center text-2xl border border-white/20">
              🎓
            </div>
            <div>
              <p className="text-[10px] text-teal-300 font-extrabold tracking-[0.2em] uppercase">
                Tutor Be
              </p>
              <p className="text-xl font-extrabold -mt-0.5">BETEA</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight mb-3">
            Ethiopia&apos;s Premier
            <br />
            <span className="text-teal-300">Verified Tutoring</span>
            <br />
            Platform
          </h2>
          <p className="text-teal-200/80 text-sm leading-relaxed mb-10">
            Connect with Fayda-verified, degree-certified tutors across Addis
            Ababa and beyond.
          </p>
          <div className="space-y-5">
            {[
              {
                icon: "🛡️",
                title: "Fayda-Verified Tutors",
                sub: "National ID + biometric confirmation",
              },
              {
                icon: "🔒",
                title: "Milestone Escrow Payments",
                sub: "Telebirr, CBE Birr, M-Pesa",
              },
              {
                icon: "📊",
                title: "AI Progress Reports",
                sub: "Weekly insights per child",
              },
              {
                icon: "📍",
                title: "GPS Session Tracking",
                sub: "Geofencing & auto check-in",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-lg">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-[11px] text-teal-300/80">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <p className="text-[11px] text-teal-200 mb-3">
            12,000+ families trust us
          </p>
          <div className="flex gap-1">
            <div className="h-1 w-10 bg-green-500 rounded-full" />
            <div className="h-1 w-10 bg-yellow-400 rounded-full" />
            <div className="h-1 w-10 bg-red-500 rounded-full" />
          </div>
        </div>
      </aside>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-2xl font-extrabold text-[var(--foreground)]">
                Sign In
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Welcome back
              </p>
            </div>
            <div className="flex gap-1">
              {["EN", "አማ", "ORO", "ትግ"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    lang === l
                      ? "bg-teal-600 text-white"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex p-1 rounded-xl gap-1 mb-5 bg-[var(--muted)]">
            {(["phone", "email"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === t
                    ? "bg-[var(--card)] text-teal-600 shadow-sm"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                {t === "phone" ? "📱 Phone" : "✉️ Email"}
              </button>
            ))}
          </div>

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-3">
              {tab === "phone" ? (
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3 border border-[var(--border)] bg-[var(--card)]">
                    <span>🇪🇹</span>
                    <span className="text-sm font-extrabold text-teal-600">
                      +251
                    </span>
                    <div className="w-px h-5 bg-[var(--border)]" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="91 234 5678"
                      className="bg-transparent text-sm flex-1 outline-none text-[var(--foreground)]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 border border-[var(--border)] bg-[var(--card)] text-sm outline-none"
                    placeholder="you@gmail.com"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 border border-[var(--border)] bg-[var(--card)] text-sm outline-none"
                />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">
                  Remember me
                </span>
                <Link href="/login" className="text-teal-600 font-semibold">
                  Forgot password?
                </Link>
              </div>

              {message && (
                <p className="text-xs text-red-500 text-center">{message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                Code sent to{" "}
                <strong className="text-[var(--foreground)]">
                  {phoneNumber}
                </strong>
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border-2 border-teal-500 px-4 py-3 text-center tracking-[0.4em] text-lg font-extrabold outline-none bg-[var(--card)]"
              />
              {message && (
                <p className="text-xs text-red-500 text-center">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm"
              >
                {loading ? "Signing in..." : "Verify & Sign In →"}
              </button>
              <button
                type="button"
                className="w-full text-xs text-[var(--muted-foreground)]"
                onClick={() => setStep("credentials")}
              >
                ← Back
              </button>
            </form>
          )}

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
            New here?{" "}
            <Link href="/register" className="text-teal-600 font-semibold">
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}