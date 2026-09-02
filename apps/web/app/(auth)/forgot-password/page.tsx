"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Optional: await api.post("/auth/otp/send", ...)
      router.push(`/reset-password?phone=${encodeURIComponent(phone)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#0A1628]">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-xl">
            🎓
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your phone. We&apos;ll send an OTP to reset your password.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Phone Number
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-[#0A1628]">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                🇪🇹 +251
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="91 234 5678"
                className="flex-1 bg-transparent text-sm outline-none text-slate-800 dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-teal-600">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}