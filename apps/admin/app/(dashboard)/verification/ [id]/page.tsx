interface Props {
  params: Promise<{ id: string }>;
}

export default async function VerificationDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        Verification Review
      </h1>
      <p className="mt-1 text-[var(--secondary)]">
        Request ID: {id} • Documents are AES-256 encrypted
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold mb-4">Submitted Documents</h3>
          <p className="text-sm text-[var(--secondary)]">
            Only authorized admins can decrypt and view these files.
          </p>
          {/* TODO: Secure document viewer */}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold mb-4">Decision</h3>
          <div className="space-y-3">
            <button className="w-full rounded-xl bg-[var(--success)] py-2.5 text-white font-medium">
              Approve & Issue Badges
            </button>
            <button className="w-full rounded-xl bg-[var(--error)] py-2.5 text-white font-medium">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
