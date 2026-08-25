"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setToken } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"PARENT" | "TEACHER">("PARENT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${getApiUrl()}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          role,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Registration failed");
      }

      const data = await res.json();
      if (data.accessToken) setToken(data.accessToken);

      router.push(role === "TEACHER" ? "/teacher" : "/parent");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
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
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Account</h1>
          <p className="text-xs text-[var(--secondary)] mt-1">Join as a Parent or Tutor</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Yohannes Abebe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Email (Gmail / Work)</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="+2519xxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">I want to join as</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === "PARENT"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--secondary)]"
                }`}
              >
                👨‍👩‍👧 Parent
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  role === "TEACHER"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--secondary)]"
                }`}
              >
                🧑‍🏫 Tutor / Teacher
              </button>
            </div>
          </div>

          {message && (
            <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg text-center font-medium">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-sm font-bold shadow-md hover:opacity-95 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

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