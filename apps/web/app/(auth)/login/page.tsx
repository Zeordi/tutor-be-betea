"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleDemoLogin = async (role: "PARENT" | "TEACHER") => {
    setDemoLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${api}/auth/demo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Demo login disabled");
      }
      const data = await res.json();
      if (data.accessToken) setToken(data.accessToken);
      redirectByRole(role);
    } catch (err: any) {
      setMessage(err.message || "Demo login failed");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGoogle = async () => {
    setMessage("Connect Google Sign-In client next (needs GOOGLE_CLIENT_ID).");
    // Later: Google Identity Services → idToken → POST /auth/google
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background)]">
      <div className="w-full max-w-md card shadow-lg border border-[var(--border)] p-8 rounded-3xl bg-[var(--surface)]">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-black text-[var(--primary)] inline-flex items-center gap-2 mb-2">
            <span>🎓</span> Tutor Be Betea
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-xs text-[var(--secondary)] mt-1">Phone + password + OTP</p>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
          <p className="text-xs font-bold mb-2.5">⚡ Dev preview only</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleDemoLogin("PARENT")} disabled={demoLoading}
              className="px-3 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold">
              Parent demo
            </button>
            <button type="button" onClick={() => handleDemoLogin("TEACHER")} disabled={demoLoading}
              className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
              Teacher demo
            </button>
          </div>
        </div>

        <button type="button" onClick={handleGoogle}
          className="w-full mb-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold">
          Continue with Google
        </button>

        {step === "credentials" ? (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Phone number</label>
              <input type="tel" required value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09xxxxxxxx or +2519xxxxxxxx"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">Password</label>
              <input type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none" />
            </div>
            {message && <p className="text-xs text-red-500 text-center">{message}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-sm font-bold">
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <p className="text-xs text-[var(--secondary)]">
              Enter the OTP sent to <strong>{phoneNumber}</strong>
            </p>
            <input type="text" inputMode="numeric" maxLength={6} required value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-center tracking-[0.3em] text-lg outline-none" />
            {message && <p className="text-xs text-red-500 text-center">{message}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-sm font-bold">
              {loading ? "Signing in..." : "Verify & Sign in"}
            </button>
            <button type="button" className="w-full text-xs text-[var(--secondary)]"
              onClick={() => setStep("credentials")}>
              Back
            </button>
          </form>
        )}

        <p className="text-xs text-[var(--secondary)] mt-6 text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[var(--primary)] font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}