interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobPublicPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Job Details</h1>
        <p className="mt-2 text-[var(--secondary)]">Job ID: {id}</p>

        {/* TODO: Job information for public viewing */}
      </div>
    </main>
  );
}
