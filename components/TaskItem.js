export function TaskItem({ title, duration, link, completed, onToggle }) {
  const hasLink = typeof link === "string" && /^https?:\/\//i.test(link.trim());

  return (
    <div
      className={[
        "flex gap-4 rounded-xl border border-slate-200/90 bg-white p-4 transition-all duration-200 dark:border-slate-800 dark:bg-slate-900/60",
        completed
          ? "opacity-60 dark:opacity-50"
          : "hover:border-slate-300 hover:shadow-sm dark:hover:border-slate-700",
      ].join(" ")}
    >
      <label className="flex cursor-pointer items-start gap-3 pt-0.5">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-sky-500"
        />
        <span className="sr-only">Mark complete</span>
      </label>
      <div className="min-w-0 flex-1 space-y-1">
        {hasLink ? (
          <a
            href={link.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "block text-base font-semibold text-slate-900 underline-offset-2 transition hover:text-sky-600 hover:underline dark:text-white dark:hover:text-sky-400",
              completed ? "line-through" : "",
            ].join(" ")}
          >
            {title}
          </a>
        ) : (
          <span
            className={[
              "block text-base font-semibold text-slate-900 dark:text-white",
              completed ? "line-through" : "",
            ].join(" ")}
          >
            {title}
          </span>
        )}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Duration: <span className="tabular-nums">{duration}</span>
        </p>
        {hasLink && (
          <a
            href={link.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
          >
            Watch on YouTube →
          </a>
        )}
      </div>
    </div>
  );
}
