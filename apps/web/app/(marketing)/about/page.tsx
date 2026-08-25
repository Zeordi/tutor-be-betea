import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-xl text-blue-900 flex items-center gap-2">
          <span>🎓</span> Tutor Be Betea
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="/how-it-works" className="hover:text-blue-600 transition">
            How It Works
          </Link>
          
          {/* --> ADD THE ABOUT LINK HERE <-- */}
          <Link href="/about" className="hover:text-blue-600 transition">
            About Us
          </Link>

          <Link href="/pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>
          <Link href="/for-parents" className="hover:text-blue-600 transition">
            For Parents
          </Link>
          <Link href="/for-tutors" className="hover:text-blue-600 transition">
            For Tutors
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}