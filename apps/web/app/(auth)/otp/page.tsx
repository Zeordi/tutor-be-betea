"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phoneNumber = searchParams.get("phone") || "";
  const fullName = searchParams.get("fullName") || "";
  const role = searchParams.get("role") || "PARENT";
  const mode = searchParams.get("mode") || "login";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const redirectByRole = (userRole: string) => {
    if (userRole === "TEACHER") router.push("/teacher");
    else router.push("/parent");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber, code: otp }),
        }
      );

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.message || "Invalid or expired OTP");
      }

      if (mode === "register") {
        const registerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, fullName, role }),
          }
        );

        if (!registerRes.ok) {
          const err = await registerRes.json().catch(() => ({}));
          throw new Error(err.message || "Registration failed");
        }

        const data = await registerRes.json();
        if (data.accessToken) localStorage.setItem("token", data.accessToken);
        redirectByRole(data?.user?.role || role);
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
        if (data.accessToken) localStorage.setItem("token", data.accessToken);
        redirectByRole(data?.user?.role || role);
      }
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            className="w-full rounded-xl border border-[var(--border)] px-4 py-3 tracking-[0.3em] text-center text-lg outline-none"
          />

          {message && <p className="text-sm text-[var(--secondary)]">{message}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center">Loading...</main>}>
      <OtpForm />
    </Suspense>
  );
}