"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "TEACHER">("PARENT");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("EN");

  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${api}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send OTP");
      }
      setStep("otp");
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
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center text-2xl">🎓</div>
            <div>
              <p className="text-[10px] text-teal-300 font-extrabold tracking-widest uppercase">Tutor Be</p>
              <p className="text-xl font-extrabold">BETEA</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-3">Join Ethiopia&apos;s trusted tutoring network</h2>
          <p className="text-teal-200/80 text-sm">Parents and verified tutors · Escrow · Safety first</p>
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-10 bg-green-500 rounded-full" />
          <div className="h-1 w-10 bg-yellow-400 rounded-full" />
          <div className="h-1 w-10 bg-red-500 rounded-full" />
        </div>
      </aside>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="text-2xl font-extrabold text-[var(--foreground)]">Create Account</p>
              <p className="text-sm text-[var(--muted-foreground)]">Join 12,000+ families</p>
            </div>
            <div className="flex gap-1">
              {["EN", "አማ", "ORO", "ትግ"].map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${lang === l ? "bg-teal-600 text-white" : "text-[var(--muted-foreground)]"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex p-1 rounded-xl gap-1 mb-4 bg-[var(--muted)]">
            {(["PARENT", "TEACHER"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${role === r ? "bg-[var(--card)] text-teal-600 shadow-sm" : "text-[var(--muted-foreground)]"}`}>
                {r === "PARENT" ? "👨‍👩‍👧 Parent" : "🧑‍🏫 Tutor"}
              </button>
            ))}
          </div>

          {step === "form" ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Full name *</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Phone *</label>
                <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)]">
                  <span className="text-sm font-extrabold text-teal-600">+251</span>
                  <div className="w-px h-5 bg-[var(--border)]" />
                  <input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="91 234 5678" className="bg-transparent text-sm flex-1 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)] block mb-1">Password *</label>
                <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 border border-[var(--border)] bg-[var(--card)] text-sm outline-none" />
              </div>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                By continuing you agree to Terms, Privacy, and Escrow Agreement.
              </p>
              {message && <p className="text-xs text-red-500 text-center">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm">
                {loading ? "Sending OTP..." : "Create Account — Verify Phone →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <p className="text-xs text-[var(--muted-foreground)] text-center">
                Enter OTP sent to <strong>{phoneNumber}</strong>
              </p>
              <input required type="text" inputMode="numeric" maxLength={6} value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border-2 border-teal-500 px-4 py-3 text-center tracking-[0.4em] text-lg font-extrabold outline-none bg-[var(--card)]" />
              {message && <p className="text-xs text-red-500 text-center">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl text-sm">
                {loading ? "Creating..." : "Verify & Create account"}
              </button>
              <button type="button" className="w-full text-xs text-[var(--muted-foreground)]" onClick={() => setStep("form")}>
                ← Back
              </button>
            </form>
          )}

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
            Already a member? <Link href="/login" className="text-teal-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}