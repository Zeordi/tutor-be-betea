"use client";

import { useState } from "react";

export default function TeacherVerificationPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadDocument = async (documentType: string, file?: File | null) => {
    if (!file) return;
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vault/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }

      setMessage(`${documentType} uploaded successfully. Waiting for admin review.`);
    } catch (error: any) {
      setMessage(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Document Verification</h1>
        <p className="text-[var(--secondary)] mb-8">
          Upload your documents to the secure vault. Only admins can view them.
        </p>

        <div className="space-y-4">
          {[
            { type: "NATIONAL_ID", label: "National ID / Fayda" },
            { type: "DEGREE", label: "Degree / Transcript" },
            { type: "LIVENESS_SELFIE", label: "Liveness Selfie" },
          ].map((doc) => (
            <div key={doc.type} className="card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold">{doc.label}</h3>
                  <p className="text-sm text-[var(--secondary)]">
                    Encrypted and admin-only access
                  </p>
                </div>
                <label className="btn btn-primary cursor-pointer">
                  {loading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      uploadDocument(doc.type, e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <p className="text-sm text-[var(--secondary)] mt-6">{message}</p>
        )}
      </section>
    </main>
  );
}