import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/50 to-brand-900/80" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20 text-white">
        <p className="animate-fade-up font-display text-5xl tracking-tight md:text-7xl">BeTea</p>
        <h1 className="animate-fade-up mt-4 max-w-xl text-2xl font-medium md:text-3xl" style={{ animationDelay: '80ms' }}>
          Trusted tutors for every learner at home
        </h1>
        <p className="animate-fade-up mt-4 max-w-lg text-lg text-white/85" style={{ animationDelay: '160ms' }}>
          Search verified teachers, book sessions, and stay connected — built for parents and tutors.
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
          <Link
            href="/register"
            className="rounded-md bg-accent px-5 py-3 font-medium text-brand-900 transition hover:brightness-110"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-white/40 px-5 py-3 font-medium transition hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
