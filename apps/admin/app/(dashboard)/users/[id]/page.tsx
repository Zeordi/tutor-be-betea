interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">
        User Details
      </h1>
      <p className="mt-1 text-[var(--secondary)]">User ID: {id}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold">Profile Information</h3>
          {/* TODO: User data */}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h3 className="font-semibold">Account Status</h3>
          {/* TODO: Status, roles, actions */}
        </div>
      </div>
    </div>
  );
}