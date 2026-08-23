"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Step 1: send OTP (or login if you later support password)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      setMessage("OTP sent successfully. Continue to verification.");
      router.push(`/otp?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-[var(--secondary)] mb-8">
          Login to your Tutor Be Betea account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+2519xxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>

          {message && (
            <p className="text-sm text-[var(--secondary)]">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Please wait..." : "Continue"}
          </button>
        </form>

        <p className="text-sm text-[var(--secondary)] mt-6 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-[var(--primary)] font-semibold">
            Create Account
          </a>
        </p>
      </div>
    </main>
  );
}