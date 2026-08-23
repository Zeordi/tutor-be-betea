"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("PARENT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send OTP first, then complete registration after verification
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }

      // Pass data to OTP page
      const params = new URLSearchParams({
        phone: phoneNumber,
        fullName,
        role,
        mode: "register",
      });

      router.push(`/otp?${params.toString()}`);
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-[var(--secondary)] mb-8">
          Join as a Parent or Tutor
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>

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

          <div>
            <label className="block text-sm font-semibold mb-2">I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            >
              <option value="PARENT">Parent</option>
              <option value="TEACHER">Tutor</option>
            </select>
          </div>

          {message && (
            <p className="text-sm text-[var(--secondary)]">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-[var(--secondary)] mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-[var(--primary)] font-semibold">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}