function DifficultyBadge({ value }) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const low = raw.toLowerCase();
  let ring =
    "bg-slate-100 text-slate-700 ring-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600";
  if (low.includes("easy"))
    ring =
      "bg-emerald-100 text-emerald-800 ring-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800";
  else if (low.includes("medium"))
    ring =
      "bg-amber-100 text-amber-900 ring-amber-200/90 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800";
  else if (low.includes("hard"))
    ring =
      "bg-rose-100 text-rose-900 ring-rose-200/90 dark:bg-rose-950/50 dark:text-rose-200 dark:ring-rose-800";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${ring}`}
    >
      {raw}
    </span>
  );
}

function PlatformBadge({ value }) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const low = raw.toLowerCase();
  let cls =
    "bg-slate-100 text-slate-700 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600";
  if (low.includes("leetcode"))
    cls =
      "bg-sky-100 text-sky-900 ring-sky-200/80 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-800";
  if (low === "gfg" || low.includes("geeks"))
    cls =
      "bg-lime-100 text-lime-900 ring-lime-200/80 dark:bg-lime-950/40 dark:text-lime-200 dark:ring-lime-800";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${cls}`}
    >
      {raw}
    </span>
  );
}

export function ProblemItem({
  noteFieldId,
  probId,
  title,
  link,
  difficulty,
  platform,
  sheetApproach,
  completed,
  onToggle,
  userNote,
  onUserNoteChange,
}) {
  const hasLink = typeof link === "string" && /^https?:\/\//i.test(link.trim());
  const titleEl = hasLink ? (
    <a
      href={link.trim()}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "font-medium text-slate-900 underline-offset-2 hover:text-sky-600 hover:underline dark:text-white dark:hover:text-sky-400 sm:text-[15px]",
        completed ? "line-through" : "",
      ].join(" ")}
    >
      {title}
    </a>
  ) : (
    <span
      className={[
        "font-medium text-slate-900 dark:text-white sm:text-[15px]",
        completed ? "line-through" : "",
      ].join(" ")}
    >
      {title}
    </span>
  );

  const approachFromSheet = String(sheetApproach || "").trim();

  return (
    <div
      className={[
        "flex gap-3 rounded-xl border border-slate-200/90 bg-white p-4 transition-all dark:border-slate-800 dark:bg-slate-900/50",
        completed ? "opacity-65" : "",
      ].join(" ")}
    >
      <label className="flex cursor-pointer items-start pt-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-sky-500"
        />
        <span className="sr-only">Mark problem done</span>
      </label>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {titleEl}
          {probId ? (
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {probId}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <DifficultyBadge value={difficulty} />
          <PlatformBadge value={platform} />
        </div>
        {approachFromSheet ? (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
            <span className="mr-2 font-semibold text-slate-600 dark:text-slate-400">
              Sheet notes:
            </span>
            {approachFromSheet}
          </p>
        ) : null}
        <div>
          <label
            htmlFor={noteFieldId}
            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
          >
            Your approach / notes{" "}
            <span className="font-normal normal-case text-slate-400 dark:text-slate-500">
              (optional)
            </span>
          </label>
          <textarea
            id={noteFieldId}
            rows={3}
            value={userNote}
            onChange={(e) => onUserNoteChange(e.target.value)}
            placeholder="Write your approach, complexity, pitfalls…"
            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
