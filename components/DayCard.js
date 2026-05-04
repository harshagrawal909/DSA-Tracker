import Link from "next/link";

export function DayCard({ day, isCurrent }) {
  return (
    <Link
      href={`/day/${day}`}
      className={[
        "group relative flex min-h-[5.5rem] flex-col justify-center rounded-2xl border px-4 py-4 shadow-sm transition-all duration-200",
        isCurrent
          ? "border-sky-400 bg-gradient-to-br from-sky-50 to-cyan-50 ring-2 ring-sky-400/40 hover:ring-sky-400/60 dark:border-sky-500/60 dark:from-sky-950/80 dark:to-cyan-950/50 dark:ring-sky-400/30"
          : "border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700",
      ].join(" ")}
    >
      {isCurrent && (
        <span className="absolute right-3 top-3 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white dark:bg-sky-500">
          Current
        </span>
      )}
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Day
      </span>
      <span className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
        {day}
      </span>
      <span className="mt-2 text-xs font-medium text-sky-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400">
        Open day →
      </span>
    </Link>
  );
}
