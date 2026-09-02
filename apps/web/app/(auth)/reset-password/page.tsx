"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") || "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6 || password !== confirm) {
      setError("Passwords must match and be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Optional: await api.post("/auth/password/reset", { phone, otp, newPassword: password })
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#0A1628]">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
        <h1 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          OTP sent to {phone || "your phone"}. Choose a new password.
        </p>
        <form onSubmit={submit} className="space-y-4">
          {[
            { label: "OTP Code", value: otp, set: setOtp, type: "text" },
            { label: "New Password", value: password, set: setPassword, type: "password" },
            { label: "Confirm Password", value: confirm, set: setConfirm, type: "password" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none dark:border-slate-700 dark:bg-[#0A1628] dark:text-white"
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="font-semibold text-teal-600">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}