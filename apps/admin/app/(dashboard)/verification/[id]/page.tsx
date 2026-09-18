"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { adminApi, type AdminUser, type AdminVaultDocument } from "@/lib/adminApi";

export default function VerificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [docs, setDocs] = useState<AdminVaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    try {
      const [userData, vaultData] = await Promise.all([
        adminApi.user(id),
        adminApi.vaultTeacherDocuments(id),
      ]);
      if (!cancelled) {
        setUser(userData as AdminUser);
        setDocs(Array.isArray(vaultData) ? vaultData : []);
      }
    } catch (err: any) {
      if (!cancelled) setError(err.message || "Failed to load verification case");
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setActionId(id);
    try {
      await adminApi.approveVerification(id);
      alert("Verification approved. Trust badges issued.");
      router.push("/verification");
    } catch (err: any) {
      alert(err.message || "Failed to approve");
    } finally {
      setActionId(null);
    }
  };

  const handleRequestMore = async () => {
    if (!id) return;
    const pendingDoc = docs.find((d) => d.status === "PENDING");
    if (!pendingDoc) {
      alert("No pending documents to request more info for.");
      return;
    }
    const reason = prompt("What additional information do you need?") || "Please provide additional documents.";
    setActionId(pendingDoc.id);
    try {
      await adminApi.requestMoreVerification(pendingDoc.id, reason);
      alert("Request for more info sent.");
      load();
    } catch (err: any) {
      alert(err.message || "Failed to request more info");
    } finally {
      setActionId(null);
    }
  };

  const handleRevoke = async () => {
    if (!id) return;
    const reason = prompt("Reason for revocation:") || "Verification revoked.";
    setActionId(id);
    try {
      await adminApi.revokeVerification(id, reason);
      alert("Verification revoked.");
      load();
    } catch (err: any) {
      alert(err.message || "Failed to revoke");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Review"
        subtitle={user ? `${user.fullName} · Admin eyes only · AES-256 vault` : `Case ${id} · Admin eyes only · AES-256 vault`}
        action={
          <Link href="/verification" className="text-sm font-semibold text-slate-500 hover:text-teal-600">
            ← Back to queue
          </Link>
        }
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <div className="rounded-2xl border-2 border-red-300 bg-white p-5 dark:border-red-800 dark:bg-[#112240]">
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-xs font-bold text-red-700 dark:text-red-400">
            🔐 Document Vault — Admin Only
          </p>
          <p className="text-[10px] text-red-600 dark:text-red-500">
            AES-256 · Access logged · NEVER public · Raw identity docs
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading case…</div>
        ) : user ? (
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{user.fullName}</p>
              <p className="text-xs text-slate-500">
                {user.phoneNumber || "—"} · {user.role} · {user.status || "PENDING_VERIFICATION"}
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {docs.length === 0 ? (
            <div className="sm:col-span-2 px-4 py-8 text-center text-sm text-slate-500">
              No vault documents found for this user.
            </div>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                className={`rounded-xl border-2 p-4 text-center ${
                  doc.status === "APPROVED"
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                    : doc.status === "REJECTED"
                      ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                }`}
              >
                <p className="text-2xl">📄</p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {doc.documentType.replace(/_/g, " ")}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    doc.status === "APPROVED"
                      ? "text-emerald-600"
                      : doc.status === "REJECTED"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {doc.status === "APPROVED" ? "✓ " : doc.status === "REJECTED" ? "✗ " : "⏳ "}
                  {doc.status.replace(/_/g, " ")}
                </p>
                {doc.adminNote && (
                  <p className="mt-1 text-[10px] text-slate-500">Note: {doc.adminNote}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleApprove}
          disabled={!!actionId}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {actionId ? "…" : "✓ Approve & Issue Badges"}
        </button>
        <button
          onClick={handleRequestMore}
          disabled={!!actionId}
          className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
        >
          {actionId ? "…" : "Request More Docs"}
        </button>
        <button
          onClick={handleRevoke}
          disabled={!!actionId}
          className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
        >
          {actionId ? "…" : "Revoke"}
        </button>
      </div>
    </div>
  );
}
