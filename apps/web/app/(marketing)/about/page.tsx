import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Tutor Be Betea",
  description: "Learn about Tutor Be Betea's mission for trusted home and online tutoring across Ethiopia.",
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto space-y-16">
        {/* Mission Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="badge">Our Mission</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] leading-tight">
            Empowering Ethiopian Students with Trusted, High-Impact Tutoring
          </h1>
          <p className="text-lg text-[var(--secondary)] leading-relaxed">
            Tutor Be Betea connects parents with verified, top-tier educators across Addis Ababa and beyond.
            We blend academic rigor with safety, transparency, and modern payment protection.
          </p>
        </div>

        {/* 3 Core Vetting Steps */}
        <div className="card p-8 bg-[var(--surface)] border border-[var(--border)] rounded-3xl space-y-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center">
            How Our Verification & Safety Vault Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <div className="text-2xl mb-3">🪪</div>
              <h3 className="font-bold mb-1 text-[var(--foreground)]">1. National ID Vetting</h3>
              <p className="text-sm text-[var(--secondary)]">
                Fayda, Kebele ID, or Passport identity verification with biometric liveness checks.
              </p>
            </div>
            <div className="p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <div className="text-2xl mb-3">🎓</div>
              <h3 className="font-bold mb-1 text-[var(--foreground)]">2. Degree Authentication</h3>
              <p className="text-sm text-[var(--secondary)]">
                Academic credentials and transcripts verified before Trust Badges are awarded.
              </p>
            </div>
            <div className="p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-bold mb-1 text-[var(--foreground)]">3. AES-256 Vault</h3>
              <p className="text-sm text-[var(--secondary)]">
                Raw documents are encrypted and never exposed. Parents see verified badges only.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <h3 className="font-bold text-lg mb-2 text-[var(--foreground)]">💳 Escrow Security</h3>
            <p className="text-sm text-[var(--secondary)]">
              Payments via Telebirr and CBE Birr are held safely in escrow until you confirm completed lessons.
            </p>
          </div>
          <div className="card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <h3 className="font-bold text-lg mb-2 text-[var(--foreground)]">📍 Geofenced Check-ins</h3>
            <p className="text-sm text-[var(--secondary)]">
              GPS verification ensures tutors are physically present within 150m of your home.
            </p>
          </div>
          <div className="card p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <h3 className="font-bold text-lg mb-2 text-[var(--foreground)]">📊 Weekly Reports</h3>
            <p className="text-sm text-[var(--secondary)]">
              Track your child&apos;s curriculum progress, quiz scores, and focus areas weekly.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card text-center p-10 bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
          <h2 className="text-2xl font-bold mb-3 text-[var(--foreground)]">Start Your Learning Journey Today</h2>
          <p className="text-sm text-[var(--secondary)] mb-6 max-w-lg mx-auto">
            Find the right tutor for Ministry of Education, Cambridge IGCSE, or American curriculum.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register?role=PARENT" className="btn btn-primary">
              Find a Tutor
            </Link>
            <Link href="/for-tutors" className="btn btn-secondary">
              Become a Tutor
            </Link>
          </div>
          <div className="mt-6 text-xs text-[var(--secondary)]">
            Questions? <Link href="/contact" className="text-[var(--primary)] underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}