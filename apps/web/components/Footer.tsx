import Link from "next/link";

const COLS = [
  {
    title: "Platform",
    links: [
      { href: "/tutors", label: "Find Tutors" },
      { href: "/for-tutors", label: "Become a Tutor" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/contact", label: "Report Issue" },
      { href: "/help", label: "FAQ" },
    ],
  },
  {
    title: "Trust & Safety",
    links: [
      { href: "/about", label: "Background Checks" },
      { href: "/about", label: "Fayda ID Verify" },
      { href: "/about", label: "Replacement Guarantee" },
      { href: "/about", label: "Community Rules" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Careers" },
      { href: "/contact", label: "Press" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white dark:bg-[#0A1628]">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-14 md:px-6">
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/15 text-lg">
                📚
              </div>
              <span className="text-base font-extrabold">Tutor Be Betea</span>
            </div>
            <p className="mb-5 max-w-[260px] text-[13px] leading-relaxed text-white/65">
              Ethiopia&apos;s trusted tutoring marketplace. Safe, verified, and
              built for Ethiopian families.
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-[#0072CE] px-2.5 py-1 text-[11px] font-bold">
                Telebirr
              </span>
              <span className="rounded-md bg-[#8A1538] px-2.5 py-1 text-[11px] font-bold">
                CBE Birr
              </span>
              <span className="rounded-md bg-[#00A859] px-2.5 py-1 text-[11px] font-bold">
                M-Pesa
              </span>
            </div>
            <p className="text-xs text-white/50">
              <span className="font-mono font-semibold text-teal-300">12,847+</span>{" "}
              Tutors ·{" "}
              <span className="font-mono font-semibold text-teal-300">284,000+</span>{" "}
              Safe Sessions
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-3.5 text-[13px] font-bold text-white/90">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-white/55 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © 2026 Tutor Be Betea · Addis Ababa, Ethiopia · All rights reserved
          </p>
          <div className="flex flex-wrap gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <Link
                key={l}
                href="/about"
                className="text-xs text-white/45 transition hover:text-white"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Ethiopian flag bar */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-yellow-400" />
        <div className="flex-1 bg-red-500" />
      </div>
    </footer>
  );
}