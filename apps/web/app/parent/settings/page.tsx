"use client";

import { useRouter } from "next/navigation";

export default function ParentSettingsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--secondary)] mb-8">
          Manage your account preferences.
        </p>

        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-1">Account</h3>
            <p className="text-sm text-[var(--secondary)]">
              Update your profile details and phone number.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-1">Notifications</h3>
            <p className="text-sm text-[var(--secondary)]">
              Choose which alerts you want to receive.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-1">Security</h3>
            <p className="text-sm text-[var(--secondary)]">
              Manage login security and active sessions.
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