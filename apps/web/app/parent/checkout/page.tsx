"use client";

import { useEffect, useState } from "react";
import { apiFetch, paths } from "@/lib/api";

const STEPS = ["Package", "Schedule", "Payment", "Confirm"];
const PACKS = [
  { id: 0, label: "Single Session", price: "450 ETB", amount: 450, detail: "60–90 min" },
  { id: 1, label: "Starter Pack (8 hrs)", price: "2,400 ETB", amount: 2400, detail: "Save 800 ETB" },
  { id: 2, label: "Monthly Intensive (20 hrs)", price: "4,800 ETB", amount: 4800, detail: "Most popular" },
];

type ProviderOption = {
  id: string;
  label: string;
  color: string;
  available: boolean;
};

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [pack, setPack] = useState(2);
  const [pay, setPay] = useState("telebirr");
  const [contractId, setContractId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [providers, setProviders] = useState<ProviderOption[]>([
    { id: "telebirr", label: "Telebirr", color: "#0072CE", available: true },
    { id: "cbe", label: "CBE Birr", color: "#8A1538", available: true },
    { id: "mpesa", label: "M-Pesa", color: "#00A859", available: true },
  ]);

   const selectedProvider = providers.find((p) => p.id === pay);

  const providerMap: Record<string, string> = {
    telebirr: "TELEBIRR",
    cbe: "CBE_BIRR",
    mpesa: "MPESA",
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      providers.map((p) =>
        apiFetch<{ available: boolean }>(`/payments/status/check?provider=${providerMap[p.id] || p.id.toUpperCase()}`)
          .then((data) => {
            if (!cancelled) {
              setProviders((prev) =>
                prev.map((pr) =>
                  pr.id === p.id ? { ...pr, available: (data as any).available ?? false } : pr,
                ),
              );
            }
          })
          .catch(() => {
            if (!cancelled) {
              setProviders((prev) =>
                prev.map((pr) =>
                  pr.id === p.id ? { ...pr, available: false } : pr,
                ),
              );
            }
          }),
      ),
    ).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!paymentId || !polling) return;
    const interval = setInterval(async () => {
      try {
        const data = await apiFetch<{ status: string }>(paths.paymentStatus(paymentId));
        if (data.status === "SUCCESS" || data.status === "FAILED") {
          setPolling(false);
          if (data.status === "SUCCESS") {
            setConfirmed(true);
          } else {
            setError("Payment failed. Please try again.");
          }
        } else if (data.status === "PENDING") {
          apiFetch(paths.paymentReconcile(paymentId), { method: "POST" }).catch(() => {});
        }
      } catch {
        // keep polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [paymentId, polling]);

  const handlePay = async () => {
    if (!selectedProvider?.available) {
      setError(`${selectedProvider?.label || "This provider"} is not configured. Contact support.`);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const provider = pay === "telebirr" ? "TELEBIRR" : pay === "cbe" ? "CBE_BIRR" : "MPESA";
      const result = await apiFetch<{
        payment?: any;
        redirectUrl?: string;
        externalRef?: string;
        message?: string;
      }>(paths.paymentsInitiate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: PACKS[pack].amount, provider, contractId: contractId || undefined }),
      });

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }

      if (result.payment?.id) {
        setPaymentId(result.payment.id);
        setPolling(true);
        setError("Waiting for payment confirmation…");
      } else {
        setError("Payment initiated but no redirect received. Please check your wallet.");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-black text-[var(--foreground)]">Book & Pay</h1>
      <p className="mb-8 text-sm text-[var(--secondary)]">
        Escrow-protected · Telebirr · CBE Birr · M-Pesa
      </p>

      {!confirmed && (
        <>
          <div className="mb-8 flex gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i <= step
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--secondary)]"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] font-semibold text-[var(--secondary)]">{s}</span>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-3">
              {PACKS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPack(p.id)}
                  className={`w-full rounded-2xl border-[1.5px] p-4 text-left ${
                    pack === p.id
                      ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                      : "border-[var(--border)] bg-[var(--card)]"
                  }`}
                >
                  <p className="font-bold text-[var(--foreground)]">{p.label}</p>
                  <p className="text-sm text-[var(--secondary)]">
                    {p.price} · {p.detail}
                  </p>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 w-full rounded-xl bg-[var(--primary)] py-3.5 font-bold text-white"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="mb-4 font-bold text-[var(--foreground)]">Pick first session slot</p>
              {/* C4: hardcoded slots kept because no parent-safe availability read exists yet */}
              <p className="mb-2 text-xs text-[var(--secondary)]">
                Available slots shown below are placeholders. Once teacher availability is exposed to parents, this will load real open slots.
              </p>
              <div className="mb-6 grid grid-cols-3 gap-2">
                {["Mon 10:00", "Wed 14:00", "Fri 09:00"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-xl border border-[var(--border)] bg-[var(--muted)] py-3 text-sm font-semibold text-[var(--foreground)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-3 font-bold text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="mb-4 font-bold text-[var(--foreground)]">Payment method</p>
              {providers.map((pr) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => setPay(pr.id)}
                  disabled={!pr.available}
                  className={`mb-2 flex w-full items-center gap-3 rounded-xl border px-4 py-3 ${
                    pay === pr.id
                      ? "border-[var(--primary)] bg-teal-50 dark:bg-teal-950/30"
                      : "border-[var(--border)]"
                  } ${!pr.available ? "opacity-50" : ""}`}
                >
                  <span
                    className="rounded px-2 py-0.5 text-xs font-bold text-white"
                    style={{ background: pr.color }}
                  >
                    {pr.label}
                  </span>
                  <span className="text-sm text-[var(--secondary)]">
                    Pay with {pr.label}
                    {!pr.available && " (not configured)"}
                  </span>
                </button>
              ))}
              <p className="my-4 rounded-xl bg-teal-50 p-3 text-xs font-semibold text-[var(--primary)] dark:bg-teal-950/30">
                🔒 Funds held in escrow until sessions are confirmed
              </p>
              {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
              {polling && (
                <p className="mb-3 text-sm text-amber-600">
                  Waiting for payment confirmation… Do not close this page.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading || polling || !selectedProvider?.available}
                  className="flex-1 rounded-xl bg-[var(--primary)] py-3 font-bold text-white disabled:opacity-70"
                >
                  {loading ? "Processing…" : polling ? "Waiting…" : `Pay ${PACKS[pack].price} & Hold in Escrow`}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {confirmed && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <div className="mb-3 text-5xl">✅</div>
          <h2 className="mb-2 text-xl font-black text-[var(--foreground)]">
            Booking confirmed
          </h2>
          <p className="mb-6 text-sm text-[var(--secondary)]">
            Payment is in escrow. You will get session reminders and can track history anytime.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmed(false);
              setStep(0);
              setPaymentId(null);
              setPolling(false);
            }}
            className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
