"use client";

import { useRouter } from "next/navigation";

export default function TeacherSettingsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--secondary)] mb-8">
          Manage your tutor account preferences.
        </p>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-1">Profile</h3>
            <p className="text-sm text-[var(--secondary)]">
              Update bio, rates, subjects, and availability.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-1">Verification</h3>
            <p className="text-sm text-[var(--secondary)]">
              Manage uploaded documents and Trust Badges.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-1">Payout Settings</h3>
            <p className="text-sm text-[var(--secondary)]">
              Configure Telebirr / bank payout preferences.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}