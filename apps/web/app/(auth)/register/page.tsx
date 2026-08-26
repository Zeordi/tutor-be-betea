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
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background)]">
      <div className="w-full max-w-md card shadow-lg border border-[var(--border)] p-8 rounded-3xl bg-[var(--surface)]">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-black text-[var(--primary)] inline-flex items-center gap-2 mb-2">
            <span>🎓</span> Tutor Be Betea
          </Link>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-xs text-[var(--secondary)] mt-1">Phone + password + OTP verification</p>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Full name</label>
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Phone number</label>
              <input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09xxxxxxxx"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Email (optional)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Password</label>
              <input required type="password" minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setRole("PARENT")}
                className={`py-2.5 rounded-xl border text-xs font-bold ${role === "PARENT" ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--border)]"}`}>
                Parent
              </button>
              <button type="button" onClick={() => setRole("TEACHER")}
                className={`py-2.5 rounded-xl border text-xs font-bold ${role === "TEACHER" ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--border)]"}`}>
                Teacher
              </button>
            </div>

            {message && <p className="text-xs text-red-500 text-center">{message}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-sm font-bold">
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <p className="text-xs text-[var(--secondary)]">
              Enter OTP sent to <strong>{phoneNumber}</strong>
            </p>
            <input required type="text" inputMode="numeric" maxLength={6} value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center tracking-[0.3em] text-lg outline-none" />
            {message && <p className="text-xs text-red-500 text-center">{message}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-sm font-bold">
              {loading ? "Creating account..." : "Verify & Create account"}
            </button>
            <button type="button" className="w-full text-xs text-[var(--secondary)]" onClick={() => setStep("form")}>
              Back
            </button>
          </form>
        )}

        <p className="text-xs text-[var(--secondary)] mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}