export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <h2 className="text-lg font-medium text-slate-800">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
    </div>
  );
}
