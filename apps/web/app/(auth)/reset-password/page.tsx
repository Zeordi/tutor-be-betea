"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const api =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tutor-be-betea.onrender.com";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();

  const initialPhone = useMemo(
    () =>
      params.get("phone") ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("resetPhone") || ""
        : ""),
    [params],
  );

  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const strength =
    newPassword.length >= 10
      ? "Strong"
      : newPassword.length >= 6
        ? "OK"
        : "Too short";

  const setDigit = (i: number, v: string) => {
    const next = [...otpDigits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtpDigits(next);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (newPassword !== confirm) throw new Error("Passwords do not match");
      if (newPassword.length < 6) throw new Error("Password min 6 characters");
      const code = otpDigits.join("");
      if (code.length !== 6) throw new Error("Enter 6-digit OTP");

      const verifyRes = await fetch(`${api}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), code }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error((verifyData as any).message || "Invalid OTP");
      }

      const res = await fetch(`${api}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          verificationToken: (verifyData as any).verificationToken,
          newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Reset failed");
      }
      router.push("/login");
    } catch (err: any) {
      setMessage(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <h1 className="text-xl font-extrabold">Reset password</h1>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
        placeholder="Phone"
      />
      <div className="flex justify-between gap-2">
        {otpDigits.map((d, i) => (
          <input
            key={i}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            maxLength={1}
            className="h-12 w-10 rounded-lg border border-[var(--border)] bg-[var(--background)] text-center font-bold"
          />
        ))}
      </div>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
        placeholder="New password"
      />
      <p className="text-xs text-[var(--muted-foreground)]">Strength: {strength}</p>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
        placeholder="Confirm password"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-white"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
      {message && <p className="text-sm text-[var(--warning)]">{message}</p>}
      <Link href="/login" className="block text-center text-sm text-[var(--primary)]">
        Back to login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <Suspense fallback={<p>Loading…</p>}>
        <ResetForm />
      </Suspense>
    </main>
  );
}