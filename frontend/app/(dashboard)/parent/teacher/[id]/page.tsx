type Props = { params: { id: string } };

export default function TeacherProfilePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Teacher profile</h1>
      <p className="mt-2 text-slate-600">Teacher ID: {params.id}</p>
    </main>
  );
}
