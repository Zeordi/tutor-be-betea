import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Tutor Be Betea - Trusted Tutoring in Ethiopia",
  description:
    "Learn about Tutor Be Betea's mission to provide safe, verified, and high-quality home and online tutoring across Ethiopia.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* ==========================================
          1. HERO SECTION & MISSION
      ========================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-indigo-950 text-white py-24 px-6 sm:px-12 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-block py-1.5 px-4 rounded-full text-xs font-semibold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Our Mission & Commitment
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Empowering Every Student in Ethiopia with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300">
              Trusted, Verified Tutoring
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Tutor Be Betea was founded to bridge the educational gap in Ethiopia. We connect parents
            with thoroughly vetted, exceptional educators for both local (Ministry of Education)
            and international curricula.
          </p>
        </div>
      </section>

      {/* ==========================================
          2. CORE MISSION PILLARS
      ========================================== */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Built for Academic Excellence & Peace of Mind
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Finding a qualified tutor should never be a gamble. We replace informal referrals with
            a data-backed, secure educational ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-6">
              🇪🇹
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tailored for Ethiopia</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Full alignment with national curriculum standards (Grade 1–12, University entrance)
              as well as international programs (Cambridge IGCSE, American Curriculum, IB).
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-6">
              🔒
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Uncompromised Safety</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every lesson is backed by escrow payment protection, GPS geofenced attendance logs,
              and strict background verification.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl mb-6">
              📈
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Measurable Progress</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Parents receive weekly structured reports detailing topics covered, quiz results, and
              actionable areas for student improvement.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. HOW VERIFICATION WORKS (VAULT & BADGES)
      ========================================== */}
      <section className="bg-slate-900 text-white py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">
              Rigorous 3-Step Vetting
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
              Encrypted Document Vault & Public Trust Badges
            </h2>
            <p className="text-slate-400 mt-4 text-base sm:text-lg">
              We protect both tutor privacy and family safety through state-of-the-art encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Government ID & Liveness Check</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Every tutor submits their National ID (Fayda / Kebele / Passport) alongside real-time
                    liveness verification to ensure identity authenticity.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Academic Degree Validation</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    University diplomas, transcripts, and pedagogical credentials are authenticated by
                    our compliance officers before activation.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AES-256 Military-Grade Vault</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Original documents are encrypted and stored in our secure Document Vault. Only public
                    badges (<span className="text-emerald-400 font-medium">ID Verified</span>,{" "}
                    <span className="text-emerald-400 font-medium">Degree Verified</span>,{" "}
                    <span className="text-amber-400 font-medium">Gold Elite</span>) are displayed on profiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Badge Preview Card */}
            <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-8 space-y-6">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Public Trust Badges on Tutor Profiles
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="font-semibold text-sm">ID_VERIFIED</div>
                      <div className="text-xs text-slate-400">National ID & Liveness Confirmed</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <div>
                      <div className="font-semibold text-sm">DEGREE_VERIFIED</div>
                      <div className="text-xs text-slate-400">University Transcript Authenticated</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⭐</span>
                    <div>
                      <div className="font-semibold text-sm">GOLD_ELITE</div>
                      <div className="text-xs text-slate-400">100+ Hours & 4.9+ Rating Tier</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Top 5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SAFETY & PLATFORM PROTECTIONS
      ========================================== */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs">
            Guaranteed Protection
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
            Safety in Every Step of the Learning Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Escrow */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl mb-6">
                💳
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Escrow Protection</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Parents pay securely via Telebirr or CBE Birr into escrow. Funds are only released to
                the tutor once the parent confirms completed tutoring sessions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-blue-600 font-semibold">
              Telebirr & CBE Birr Integrated →
            </div>
          </div>

          {/* Geofenced Attendance */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-2xl mb-6">
                📍
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Geofenced Attendance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                For in-person tutoring, teachers check in via GPS. The app verifies that the educator is
                physically present within 150m of your home before logging the session.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-teal-600 font-semibold">
              150m Geofence Verification →
            </div>
          </div>

          {/* Safe On-Platform Chat */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl mb-6">
                💬
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe In-App Communication</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our in-app messaging and real-time video rooms ensure transparent communication while
                preventing unauthorized data leaks and off-platform disputes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold">
              Encrypted Messaging & Video →
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CALL TO ACTION (PARENTS & TUTORS)
      ========================================== */}
      <section className="py-16 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 sm:p-16 text-white text-center shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Experience Better Learning?
          </h2>
          <p className="text-blue-100 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Join thousands of parents and top educators transforming education in Ethiopia today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=PARENT"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-bold shadow-sm hover:bg-blue-50 transition"
            >
              Find a Tutor for Your Child
            </Link>
            <Link
              href="/register?role=TEACHER"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 border border-blue-400/40 text-white font-bold transition"
            >
              Apply to Teach (Become a Tutor)
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. CONTACT SUPPORT SECTION
      ========================================== */}
      <section className="py-12 border-t border-slate-200 text-center px-6">
        <p className="text-slate-600 text-sm">
          Have questions or want to partner with us?{" "}
          <Link
            href="/contact"
            className="text-blue-600 font-semibold hover:underline underline-offset-4"
          >
            Contact our Addis Ababa support team &rarr;
          </Link>
        </p>
      </section>
    </div>
  );
}