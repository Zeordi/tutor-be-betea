"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const identifier = authMethod === "email" ? email.trim() : phoneNumber.trim();

    try {
      const res = await fetch(`${getApiUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          authMethod === "email" ? { email: identifier } : { phoneNumber: identifier }
        ),
      });

      if (!res.ok) {
        // If user not found, try sending OTP
        const otpRes = await fetch(`${getApiUrl()}/auth/otp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            authMethod === "email" ? { email: identifier } : { phoneNumber: identifier }
          ),
        });

        if (otpRes.ok) {
          router.push(
            `/otp?${authMethod === "email" ? `email=${encodeURIComponent(identifier)}` : `phone=${encodeURIComponent(identifier)}`}`
          );
          return;
        }

        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      if (data.accessToken) setToken(data.accessToken);

      if (data.user?.role === "TEACHER") {
        router.push("/teacher");
      } else {
        router.push("/parent");
      }
    } catch (error: any) {
      setMessage(error.message || "Failed to connect to API server");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "PARENT" | "TEACHER") => {
    try {
      setDemoLoading(true);
      setMessage("");

      const res = await fetch(`${getApiUrl()}/auth/demo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      let data;
      if (res.ok) {
        data = await res.json();
        if (data.accessToken) setToken(data.accessToken);
      } else {
        // Offline dev fallback
        setToken("demo-auth-token-12345");
      }

      if (role === "TEACHER") {
        router.push("/teacher");
      } else {
        router.push("/parent");
      }
    } catch {
      // Offline direct bypass
      setToken("demo-auth-token-12345");
      router.push(role === "TEACHER" ? "/teacher" : "/parent");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--background)]">
      <div className="w-full max-w-md card shadow-lg border border-[var(--border)] p-8 rounded-3xl bg-[var(--surface)]">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-black text-[var(--primary)] inline-flex items-center gap-2 mb-2">
            <span>🎓</span> Tutor Be Betea
          </Link>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Welcome Back</h1>
          <p className="text-xs text-[var(--secondary)] mt-1">Sign in to your account</p>
        </div>

        {/* 1-Click Fast Demo Login for instant testing */}
        <div className="mb-6 p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
          <p className="text-xs font-bold text-[var(--foreground)] mb-2.5">⚡ Instant Testing (1-Click Login)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("PARENT")}
              disabled={demoLoading}
              className="px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition"
            >
              Sign in as Parent →
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("TEACHER")}
              disabled={demoLoading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
            >
              Sign in as Tutor →
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-[var(--border)]"></div>
          <span className="flex-shrink mx-3 text-xs uppercase font-semibold text-[var(--secondary)]">or continue with</span>
          <div className="flex-grow border-t border-[var(--border)]"></div>
        </div>

        {/* Method Switcher */}
        <div className="flex rounded-xl bg-[var(--surface-2)] p-1 mb-4">
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === "email" ? "bg-[var(--surface)] shadow text-[var(--foreground)]" : "text-[var(--secondary)]"
            }`}
          >
            ✉️ Email / Gmail
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("phone")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              authMethod === "phone" ? "bg-[var(--surface)] shadow text-[var(--foreground)]" : "text-[var(--secondary)]"
            }`}
          >
            📱 Phone Number
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {authMethod === "email" ? (
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[var(--foreground)]">Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[var(--foreground)]">Ethiopian Phone Number</label>
              <input
                type="tel"
                placeholder="+2519xxxxxxxx or 09xxxxxxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
              />
            </div>
          )}

          {message && (
            <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg text-center font-medium">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-sm font-bold shadow-md hover:opacity-95 transition"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

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