export function ProgressBar({ value }) {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Overall progress
        </span>
        <span className="tabular-nums font-semibold text-sky-600 dark:text-sky-400">
          {Math.round(clamped)}%
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-500 ease-out dark:from-sky-400 dark:to-cyan-400"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
