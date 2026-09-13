"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Login failed");
      }
      const role = (data as any).user?.role as string;
      const allowed = [
        "SUPER_ADMIN",
        "SUPPORT_AGENT",
        "FINANCE",
        "VERIFICATION_OFFICER",
      ];
      if (!allowed.includes(role)) {
        throw new Error("This account is not an admin user");
      }
      if ((data as any).accessToken) {
        setToken((data as any).accessToken);
        router.push("/");
      }
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Super Admin
          </h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Tutor Be Betea Administration Console
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-white"
          >
            {loading ? "Signing in…" : "Sign in securely"}
          </button>
          {message && (
            <p className="text-center text-sm text-[var(--warning)]">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}