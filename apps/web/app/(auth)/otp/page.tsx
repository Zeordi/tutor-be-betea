"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phoneNumber = searchParams.get("phone") || "";
  const fullName = searchParams.get("fullName") || "";
  const role = searchParams.get("role") || "PARENT";
  const mode = searchParams.get("mode") || "login"; // login | register

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const redirectByRole = (userRole: string) => {
    if (userRole === "TEACHER") {
      router.push("/teacher");
    } else {
      router.push("/parent");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1) Verify OTP
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            code: otp,
          }),
        }
      );

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid or expired OTP");
      }

      // 2) Register or Login
      if (mode === "register") {
        const registerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber,
              fullName,
              role,
            }),
          }
        );

        if (!registerRes.ok) {
          const err = await registerRes.json().catch(() => ({}));
          throw new Error(err.message || "Registration failed");
        }

        const data = await registerRes.json();

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }

        const userRole = data?.user?.role || role;
        setMessage("Account created successfully. Redirecting...");
        redirectByRole(userRole);
      } else {
        const loginRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber }),
          }
        );

        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => ({}));
          throw new Error(err.message || "Login failed");
        }

        const data = await loginRes.json();

        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }

        const userRole = data?.user?.role || role;
        setMessage("Login successful. Redirecting...");
        redirectByRole(userRole);
      }
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber }),
        }
      );

      if (!res.ok) throw new Error("Failed to resend OTP");
      setMessage("A new OTP has been sent.");
    } catch (error: any) {
      setMessage(error.message || "Failed to resend OTP");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
        <p className="text-[var(--secondary)] mb-8">
          Enter the code sent to <strong>{phoneNumber || "your phone"}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              6-digit code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 tracking-[0.3em] text-center text-lg outline-none focus:border-[var(--primary)]"
            />
          </div>

          {message && (
            <p className="text-sm text-[var(--secondary)]">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="btn btn-primary w-full"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-semibold text-[var(--primary)]"
          >
            Resend OTP
          </button>
        </div>

        <p className="text-sm text-[var(--secondary)] mt-6 text-center">
          Wrong number?{" "}
          <a
            href={mode === "register" ? "/register" : "/login"}
            className="text-[var(--primary)] font-semibold"
          >
            Go back
          </a>
        </p>
      </div>
    </main>
  );
}