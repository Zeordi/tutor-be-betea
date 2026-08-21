export default function FindTutorsPage() {
  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Find Tutors</h1>
        <p className="mt-3 text-[var(--secondary)]">
          Browse verified tutors near you
        </p>

        {/* TODO: Search + Filters + Tutor cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tutor cards will be rendered here */}
        </div>
      </div>
    </main>
  );
}
