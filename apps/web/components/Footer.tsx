import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="font-extrabold text-xl text-white flex items-center gap-2">
            <span>🎓</span> Tutor Be Betea
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ethiopia&apos;s premier tutoring platform. Verified educators, escrow payment protection,
            and geofenced attendance for peace of mind.
          </p>
          <div className="text-xs text-slate-500">📍 Addis Ababa, Ethiopia 🇪🇹</div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/how-it-works" className="hover:text-white transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-white transition">
                Pricing & Escrow
              </Link>
            </li>
            <li>
              <Link href="/for-parents" className="hover:text-white transition">
                For Parents
              </Link>
            </li>
            <li>
              <Link href="/for-tutors" className="hover:text-white transition">
                Become a Tutor
              </Link>
            </li>
          </ul>
        </div>

        {/* Curricula Supported */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Curricula</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>National Ministry (Grade 1–12)</li>
            <li>Cambridge IGCSE & A-Levels</li>
            <li>American Curriculum</li>
            <li>International Baccalaureate (IB)</li>
            <li>Language & Coding Bootcamps</li>
          </ul>
        </div>

        {/* Trust & Payments */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Payment & Trust
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Integrated with Telebirr and CBE Birr escrow guarantees.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
              Telebirr
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
              CBE Birr
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
              AES-256
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Tutor Be Betea. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/contact" className="hover:text-slate-300 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;