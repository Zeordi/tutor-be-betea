"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@tutor/ui";
import { setSession } from "@/lib/api";
import { getApiUrl, paths } from "@/lib/api";
import { MobileAuthHeader } from "../MobileAuthHeader";

const LANGS = ["EN", "አማ"] as const;

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "";
  const password = searchParams.get("password") || "";
  const fullName = searchParams.get("fullName") || "";
  const role = searchParams.get("role") || "PARENT";
  const mode = searchParams.get("mode") || "login";
  const { mode: themeMode, toggleTheme } = useTheme();

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");

  const setDigit = (i: number, v: string) => {
    const next = [...otpDigits];
    next[i] = v.replace(/\D/g, "").slice(-1);
    setOtpDigits(next);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const code = otpDigits.join("");
      const verifyRes = await fetch(getApiUrl() + paths.authOtpVerify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code }),
      });
      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error((err as any).message || "Invalid or expired OTP");
      }
      const verifyData = await verifyRes.json();

      if (mode === "register") {
        const registerRes = await fetch(getApiUrl() + paths.authRegister, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            fullName,
            role,
            password: password || undefined,
            verificationToken: verifyData.verificationToken,
          }),
        });
        if (!registerRes.ok) {
          const err = await registerRes.json().catch(() => ({}));
          throw new Error((err as any).message || "Registration failed");
        }
        const data = await registerRes.json();
        if (data.accessToken) setSession(data.accessToken, data.refreshToken);
        router.push(role === "TEACHER" ? "/teacher" : "/parent");
      } else {
        const loginRes = await fetch(getApiUrl() + paths.authLogin, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber,
            password,
            verificationToken: verifyData.verificationToken,
          }),
        });
        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => ({}));
          throw new Error((err as any).message || "Login failed");
        }
        const data = await loginRes.json();
        if (data.accessToken) setSession(data.accessToken, data.refreshToken);
        router.push(
          data.user?.role === "TEACHER" ? "/teacher" : "/parent",
        );
      }
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-sm space-y-6">
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--foreground)]">
              Verify Your Phone
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Enter the 6-digit code sent to your phone
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-[11px] font-bold transition ${
                    lang === l
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--secondary)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-sm"
              aria-label="Toggle theme"
            >
              {themeMode === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <MobileAuthHeader title="Verify Your Phone" subtitle="Enter the 6-digit code sent to your phone" />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-6 md:p-8">
          <div className="w-14 h-14 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
            💬
          </div>
          <p className="text-xs text-[var(--muted-foreground)] text-center mb-6">
            Code sent to <strong>{phoneNumber || "your phone"}</strong>
          </p>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  data-otp-index={i}
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !d && i > 0) {
                      const prev = document.querySelector<HTMLInputElement>(`input[data-otp-index="${i - 1}"]`);
                      prev?.focus();
                    }
                  }}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value && i < otpDigits.length - 1) {
                      const next = document.querySelector<HTMLInputElement>(`input[data-otp-index="${i + 1}"]`);
                      next?.focus();
                    }
                  }}
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-10 h-12 md:w-12 md:h-14 shrink-0 rounded-xl border-2 border-[var(--border)] bg-[var(--muted)] dark:bg-[var(--card)] text-center text-base md:text-lg font-extrabold outline-none transition focus:border-[var(--primary)]"
                />
              ))}
            </div>
            {message && (
              <p className="text-sm text-red-500 text-center">{message}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white font-bold py-3 rounded-xl hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Continue →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          Loading...
        </main>
      }
    >
      <OtpForm />
    </Suspense>
  );
}