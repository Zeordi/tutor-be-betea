import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-base">
                🎓
              </div>
              <p className="font-extrabold">Tutor Be Betea</p>
            </div>
            <p className="text-sm text-slate-400">
              Ethiopia&apos;s premier verified tutoring platform. Safe, trusted,
              effective.
            </p>
          </div>

          {[
            {
              title: "Platform",
              links: [
                { label: "Find Tutors", href: "/tutors" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Pricing", href: "/pricing" },
                { label: "For Parents", href: "/for-parents" },
              ],
            },
            {
              title: "Tutors",
              links: [
                { label: "Become a Tutor", href: "/for-tutors" },
                { label: "Verification", href: "/for-tutors" },
                { label: "Register", href: "/register" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Contact Us", href: "/contact" },
                { label: "About", href: "/about" },
                { label: "Sign In", href: "/login" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold">{col.title}</p>
              <div className="space-y-2">
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="block text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Tutor Be Betea. All rights reserved.</p>
          <div className="flex gap-2">
            <div className="h-1 w-8 rounded-full bg-green-500" />
            <div className="h-1 w-8 rounded-full bg-yellow-400" />
            <div className="h-1 w-8 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}