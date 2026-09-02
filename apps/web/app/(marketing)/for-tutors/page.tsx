import Link from "next/link";

export default function ForTutorsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A1628]">
      <section className="bg-gradient-to-br from-blue-800 to-teal-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
            🧑‍🏫 For Tutors
          </span>
          <h1 className="mb-4 text-4xl font-extrabold">
            Grow Your Tutoring Career with Tutor Be Betea
          </h1>
          <p className="mb-8 text-xl text-blue-200">
            Join 12,000+ verified tutors earning consistent income across Ethiopia
          </p>
          <Link
            href="/register"
            className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            Apply as a Tutor →
          </Link>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-extrabold text-slate-900 dark:text-white">
            Why Tutor Be Betea?
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "💰",
                "Earn 450–800+ ETB/hr",
                "Set your own rates. Get paid securely via milestone escrow.",
              ],
              [
                "🔗",
                "Connects Job System",
                "Purchase Connects to apply for jobs. Premium listings, priority placement.",
              ],
              [
                "🛡️",
                "Build Your Reputation",
                "Earn Trust Badges. Gold Top 1% tutors get 3x more bookings.",
              ],
              [
                "📊",
                "Analytics Dashboard",
                "Track earnings, sessions, student progress, and ranking.",
              ],
              [
                "📅",
                "Flexible Scheduling",
                "Set availability, manage calendar, accept sessions on your terms.",
              ],
              [
                "🚀",
                "Boost Visibility",
                "Promote your profile with Boost credits in search results.",
              ],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/80"
              >
                <p className="mb-3 text-2xl">{icon}</p>
                <p className="mb-1 font-bold text-slate-800 dark:text-white">
                  {title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-12 dark:bg-[#0D1B33]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">
            Verification Process
          </h2>
          <div className="flex flex-wrap items-start justify-center gap-2">
            {[
              ["Submit Docs", "National ID, Degree, Selfie"],
              ["Admin Review", "Secure vault review"],
              ["Get Verified", "Earn Trust Badges"],
              ["Start Earning", "Accept jobs, get paid"],
            ].map(([step, desc], i) => (
              <div key={step} className="flex items-start gap-2">
                <div className="flex w-28 flex-col items-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-extrabold text-white">
                    {i + 1}
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {step}
                  </p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
                {i < 3 && (
                  <div className="mt-5 text-lg text-slate-300 dark:text-slate-600">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}