import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--background)] text-[var(--foreground)]">
      {/* ==========================================
          SHARED MARKETING NAVBAR
      ========================================== */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>🎓</span> Tutor Be Betea
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--secondary)]">
            <Link href="/how-it-works" className="hover:text-[var(--primary)] transition">
              How It Works
            </Link>
            <Link href="/about" className="hover:text-[var(--primary)] transition">
              About Us
            </Link>
            <Link href="/pricing" className="hover:text-[var(--primary)] transition">
              Pricing
            </Link>
            <Link href="/for-parents" className="hover:text-[var(--primary)] transition">
              For Parents
            </Link>
            <Link href="/for-tutors" className="hover:text-[var(--primary)] transition">
              For Tutors
            </Link>
            <Link href="/contact" className="hover:text-[var(--primary)] transition">
              Contact
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary text-sm px-4 py-2">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ==========================================
          PAGE CONTENT
      ========================================== */}
      <main className="flex-1">{children}</main>

      {/* ==========================================
          SHARED MARKETING FOOTER
      ========================================== */}
      <footer className="border-t border-[var(--border)] py-12 bg-[var(--surface)] text-[var(--secondary)] text-sm">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-lg font-bold text-[var(--primary)] mb-2">Tutor Be Betea</div>
            <p className="text-xs text-[var(--secondary)] leading-relaxed">
              Ethiopia&apos;s trusted platform for verified home and online tutoring.
            </p>
            <div className="text-xs text-[var(--secondary)] mt-3">📍 Addis Ababa, Ethiopia 🇪🇹</div>
          </div>

          <div>
            <div className="font-semibold text-[var(--foreground)] mb-3">Platform</div>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/how-it-works" className="hover:text-[var(--primary)]">How It Works</Link>
              <Link href="/about" className="hover:text-[var(--primary)]">About Us</Link>
              <Link href="/pricing" className="hover:text-[var(--primary)]">Pricing & Escrow</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold text-[var(--foreground)] mb-3">Community</div>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/for-parents" className="hover:text-[var(--primary)]">For Parents</Link>
              <Link href="/for-tutors" className="hover:text-[var(--primary)]">Become a Tutor</Link>
              <Link href="/contact" className="hover:text-[var(--primary)]">Contact Support</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold text-[var(--foreground)] mb-3">Guaranteed Safety</div>
            <p className="text-xs leading-relaxed">
              Escrow payments via Telebirr & CBE Birr. 100% verified IDs and degree credentials.
            </p>
          </div>
        </div>

        <div className="container border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>© {new Date().getFullYear()} Tutor Be Betea. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}