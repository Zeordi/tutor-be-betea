"use client";

import { useEffect, useState } from "react";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--secondary)]">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="container py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">My Profile & Badges</h1>
        <p className="text-[var(--secondary)] mb-8">
          Manage your public tutoring profile and trust signals.
        </p>

        <div className="card mb-5">
          <h3 className="font-bold text-lg mb-2">
            {profile?.fullName || "Teacher Profile"}
          </h3>
          <p className="text-[var(--secondary)] mb-4">
            {profile?.bio || "No bio added yet."}
          </p>

          <div className="flex flex-wrap gap-2">
            {profile?.isIdVerified && <span className="badge">🛡️ ID Verified</span>}
            {profile?.isEduVerified && <span className="badge">🎓 Degree Verified</span>}
            {profile?.badgeTier && <span className="badge">🏆 {profile.badgeTier}</span>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-sm text-[var(--secondary)]">Hourly Rate</div>
            <div className="text-xl font-bold">ETB {profile?.hourlyRate || 0}</div>
          </div>
          <div className="card">
            <div className="text-sm text-[var(--secondary)]">Monthly Rate</div>
            <div className="text-xl font-bold">ETB {profile?.monthlyRate || 0}</div>
          </div>
          <div className="card">
            <div className="text-sm text-[var(--secondary)]">Rating</div>
            <div className="text-xl font-bold">
              ★ {Number(profile?.rating || 0).toFixed(1)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}