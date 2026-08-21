interface Props {
  params: Promise<{ id: string }>;
}

export default async function TutorPublicProfilePage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Tutor Profile
        </h1>
        <p className="mt-2 text-[var(--secondary)]">Tutor ID: {id}</p>

        {/* Public Trust Badges only - never raw documents */}
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-[var(--surface)] px-4 py-1.5 text-sm font-medium">
            🛡️ National ID Verified
          </span>
          <span className="rounded-full bg-[var(--surface)] px-4 py-1.5 text-sm font-medium">
            🎓 Degree Verified
          </span>
          <span className="rounded-full bg-[var(--surface)] px-4 py-1.5 text-sm font-medium">
            🥇 Gold Elite
          </span>
        </div>

        {/* TODO: Bio, subjects, rates, reviews, Hire button */}
      </div>
    </main>
  );
}
