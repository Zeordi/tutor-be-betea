export function BookingSummary({
  teacherName,
  durationMinutes,
  total,
}: {
  teacherName: string;
  durationMinutes: number;
  total: number;
}) {
  return (
    <div className="space-y-2 text-sm">
      <p>
        <span className="text-slate-500">Teacher:</span> {teacherName}
      </p>
      <p>
        <span className="text-slate-500">Duration:</span> {durationMinutes} min
      </p>
      <p className="text-base font-semibold">Total: ${total.toFixed(2)}</p>
    </div>
  );
}
