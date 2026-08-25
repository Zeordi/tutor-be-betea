"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default function VerificationDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [decrypting, setDecrypting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Viewer Tools
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Badge Selection for Approval
  const [badges, setBadges] = useState<string[]>(["ID_VERIFIED"]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    async function fetchDecrypted() {
      try {
        setLoading(true);
        setDecrypting(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/vault/${id}/decrypt`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to decrypt document");
        }

        const data = await res.json();
        setDoc(data);

        // Pre-select badges based on document type
        if (data.documentType === "DEGREE" || data.documentType === "TRANSCRIPT") {
          setBadges(["DEGREE_VERIFIED"]);
        } else if (data.documentType === "NATIONAL_ID" || data.documentType === "PASSPORT") {
          setBadges(["ID_VERIFIED"]);
        }
      } catch (err: any) {
        setError(err.message || "Could not decrypt document");
      } finally {
        setLoading(false);
        setDecrypting(false);
      }
    }

    fetchDecrypted();
  }, [id]);

  const toggleBadge = (badge: string) => {
    setBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]));
  };

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/verification/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ issueBadges: badges }),
      });

      if (!res.ok) throw new Error("Approval failed");

      alert("Document approved and Trust Badges successfully issued!");
      router.push("/verification");
    } catch (err: any) {
      alert(err.message || "Error approving document");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejecting this document");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/verification/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });

      if (!res.ok) throw new Error("Rejection failed");

      alert("Document rejected. Notification sent to teacher.");
      router.push("/verification");
    } catch (err: any) {
      alert(err.message || "Error rejecting document");
    } finally {
      setSubmitting(false);
    }
  };

  const isPdf = doc?.mimeType === "application/pdf";
  const dataUrl = doc?.base64Data ? `data:${doc.mimeType};base64,${doc.base64Data}` : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.back()} className="text-sm text-[var(--secondary)] hover:underline mb-1">
            ← Back to Queue
          </button>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Vault Document Inspection</h1>
          <p className="text-sm text-[var(--secondary)]">
            Document ID: <code className="font-mono text-xs">{id}</code> • AES-256-GCM Verified
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Audit Ledger Active
          </span>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h3 className="font-bold">Decryption Failed</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <div className="animate-spin text-3xl mb-3">🔒</div>
          <p className="font-bold">Decrypting document with Master Vault Key...</p>
          <p className="text-xs text-[var(--secondary)] mt-1">This action is being recorded in the immutable audit log.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Document Viewer Canvas */}
          <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div className="font-bold text-sm">
                {doc.documentType} ({doc.mimeType})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="px-2.5 py-1 rounded border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)]"
                >
                  Zoom -
                </button>
                <span className="text-xs font-mono">{Math.round(zoom * 100)}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="px-2.5 py-1 rounded border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)]"
                >
                  Zoom +
                </button>
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-2.5 py-1 rounded border border-[var(--border)] text-xs font-semibold hover:bg-[var(--surface-2)] ml-2"
                >
                  🔄 Rotate
                </button>
                <button
                  onClick={() => {
                    setZoom(1);
                    setRotation(0);
                  }}
                  className="px-2.5 py-1 rounded border border-[var(--border)] text-xs text-[var(--secondary)] hover:bg-[var(--surface-2)]"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Document Canvas Container with Leak-Protection Watermark Overlay */}
            <div className="relative flex-1 min-h-[500px] max-h-[700px] overflow-auto rounded-xl bg-slate-900 flex items-center justify-center p-4 select-none">
              {/* Security Watermark */}
              <div className="absolute inset-0 pointer-events-none z-10 flex flex-wrap items-center justify-center opacity-15 overflow-hidden">
                {Array.from({ length: 12 }).map((_, idx) => (
                  <div key={idx} className="p-8 text-white font-mono text-xs -rotate-12 whitespace-nowrap">
                    CONFIDENTIAL • TUTOR BE BETEA ADMIN • {new Date().toISOString().slice(0, 10)}
                  </div>
                ))}
              </div>

              {isPdf ? (
                <iframe src={dataUrl} className="w-full h-full min-h-[550px] rounded-lg border-0 bg-white" title="PDF Preview" />
              ) : (
                <div
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s ease-out",
                  }}
                  className="max-w-full flex items-center justify-center"
                >
                  <img
                    src={dataUrl}
                    alt="Decrypted Document"
                    className="max-h-[600px] object-contain rounded shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Decision & Badges Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 className="font-bold text-base mb-2">Teacher Information</h3>
              <p className="text-xs text-[var(--secondary)] mb-4">
                Teacher User ID: <code className="font-mono text-xs">{doc.teacherId}</code>
              </p>

              <div className="border-t border-[var(--border)] pt-4 space-y-3">
                <h4 className="font-bold text-sm">Award Trust Badges on Approval</h4>
                <div className="space-y-2">
                  {[
                    { id: "ID_VERIFIED", label: "🛡️ National ID / Fayda Verified" },
                    { id: "DEGREE_VERIFIED", label: "🎓 University Degree Verified" },
                    { id: "GOLD_ELITE", label: "🥇 Gold Elite Teacher Tier" },
                  ].map((badge) => (
                    <label
                      key={badge.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] cursor-pointer hover:border-[var(--primary)] transition text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={badges.includes(badge.id)}
                        onChange={() => toggleBadge(badge.id)}
                        className="rounded accent-[var(--primary)] w-4 h-4"
                      />
                      <span className="font-medium">{badge.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6 mt-6 space-y-3">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-white font-bold transition shadow-sm"
                >
                  {submitting ? "Processing..." : "✓ Approve & Issue Badges"}
                </button>

                <button
                  onClick={() => setRejectModalOpen(true)}
                  disabled={submitting}
                  className="w-full rounded-xl border border-red-200 text-red-600 hover:bg-red-50 py-3 font-bold transition"
                >
                  ✕ Reject Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xl">
            <h3 className="font-bold text-lg text-[var(--foreground)]">Reject Document</h3>
            <p className="text-xs text-[var(--secondary)] mt-1 mb-4">
              Explain why this document was rejected so the teacher can re-submit properly.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document image is blurry or expired. Please upload a clear color photo of your National ID."
              className="w-full rounded-xl border border-[var(--border)] p-3 text-sm bg-[var(--surface-2)] outline-none focus:border-[var(--primary)]"
            />

            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--secondary)] hover:bg-[var(--surface-2)]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold"
              >
                {submitting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}