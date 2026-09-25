"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MobileAuthHeader } from "../MobileAuthHeader";
import { getApiUrl, paths } from "@/lib/api";

type ResetMethod = "sms" | "telebirr" | "email";

const RESET_METHODS: { value: ResetMethod; label: string; icon: string; disabled?: boolean }[] = [
  { value: "sms", label: "SMS", icon: "📱" },
  { value: "telebirr", label: "Telebirr", icon: "💳", disabled: true },
  { value: "email", label: "Email", icon: "📧", disabled: true },
];

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Phone" },
    { num: 2, label: "Verify OTP" },
    { num: 3, label: "New Password" },
  ];

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border-2 text-xs md:text-sm font-bold transition ${
                  currentStep > step.num
                    ? "border-[#008779] bg-[#008779] text-white"
                    : currentStep === step.num
                      ? "border-[#008779] bg-[#008779] text-white"
                      : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-[#112240]"
                }`}
              >
                {currentStep > step.num ? "✓" : step.num}
              </div>
              <span
                className={`mt-1 text-[10px] md:text-xs font-medium ${
                  currentStep >= step.num
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-1 md:mx-2 h-0.5 flex-1 ${
                  currentStep > step.num ? "bg-[#008779]" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [method, setMethod] = useState<ResetMethod>("sms");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(getApiUrl() + paths.authPasswordForgot, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as any).message || "Request failed");
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("resetPhone", phoneNumber.trim());
      }
      router.push(
        `/reset-password?phone=${encodeURIComponent(phoneNumber.trim())}`,
      );
    } catch (err: any) {
      setMessage(err.message || "Could not start reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile header */}
      <div className="md:hidden">
        <MobileAuthHeader title="Forgot password" subtitle="We will send a reset code to your phone." />
      </div>

      {/* Desktop header */}
      <div className="hidden md:block mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Forgot Password
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your phone number and we will send you a reset code.
        </p>
      </div>

      <Stepper currentStep={step} />

      <form onSubmit={onSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label className="mb-1.5 block text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden dark:border-slate-700 dark:bg-slate-800/50">
            <span className="flex items-center px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-slate-500 border-r border-slate-200 dark:border-slate-700 dark:text-slate-300">
              +251
            </span>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="912345678"
              className="flex-1 bg-transparent px-3 md:px-4 py-2.5 md:py-3 text-sm outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 md:mb-2 block text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Reset via
          </label>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            {RESET_METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                disabled={m.disabled}
                onClick={() => !m.disabled && setMethod(m.value)}
                className={`flex flex-col items-center justify-center gap-0.5 md:gap-1 rounded-xl md:rounded-2xl border px-2 md:px-3 py-2.5 md:py-4 text-center transition ${
                  method === m.value && !m.disabled
                    ? "border-[#008779] bg-teal-50 dark:bg-teal-900/20"
                    : m.disabled
                      ? "border-slate-100 bg-slate-50 opacity-50 dark:border-slate-700 dark:bg-slate-800/30"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-[#112240]"
                }`}
              >
                <span className="text-lg md:text-xl">{m.icon}</span>
                <span
                  className={`text-[11px] md:text-xs font-bold ${
                    method === m.value && !m.disabled
                      ? "text-[#008779]"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {m.label}
                </span>
                {m.disabled && (
                  <span className="text-[10px] font-semibold text-slate-400">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <p className="text-xs md:text-sm text-red-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#008779] py-3 md:py-3.5 text-sm font-bold text-white hover:bg-[#006b5f] disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send Reset Code →"}
        </button>

        <Link
          href="/login"
          className="block text-center text-xs md:text-sm font-medium text-slate-500 hover:text-[#008779] dark:text-slate-400"
        >
          ← Back to Sign In
        </Link>
      </form>
    </div>
  );
}
