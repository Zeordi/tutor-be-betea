type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  icon: string;
  tone?: "teal" | "blue" | "purple" | "amber" | "orange" | "emerald";
};

const tones: Record<NonNullable<StatCardProps["tone"]>, string> = {
  teal: "text-teal-600 dark:text-teal-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  amber: "text-amber-600 dark:text-amber-400",
  orange: "text-orange-600 dark:text-orange-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
};

export default function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "teal",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#112240]">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        {delta && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {delta}
          </span>
        )}
      </div>
      <p className={`text-2xl font-extrabold ${tones[tone]}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}