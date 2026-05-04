"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dsaData, MAX_DAY } from "@/data";
import { DayCard } from "@/components/DayCard";
import { ProgressBar } from "@/components/ProgressBar";
import {
  readCompletions,
  clearCompletions,
  clearProblemNotes,
  taskKey,
  problemKey,
} from "@/lib/storage";

function getFocusDay(data, completions) {
  for (const { day, tasks, problems } of data) {
    const allVideosDone = tasks.every((_, i) => completions[taskKey(day, i)]);
    const allProblemsDone = problems.every((_, i) => completions[problemKey(day, i)]);
    const allDone = allVideosDone && allProblemsDone;
    if (!allDone) return day;
  }
  return data.length > 0 ? data[data.length - 1].day : MAX_DAY;
}

function countStats(data, completions) {
  let videoTotal = 0;
  let videoCompleted = 0;
  let problemTotal = 0;
  let problemCompleted = 0;
  for (const { day, tasks, problems } of data) {
    videoTotal += tasks.length;
    videoCompleted += tasks.filter((_, i) => completions[taskKey(day, i)]).length;
    problemTotal += problems.length;
    problemCompleted += problems.filter((_, i) => completions[problemKey(day, i)]).length;
  }
  const total = videoTotal + problemTotal;
  const completed = videoCompleted + problemCompleted;
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const videoPct = videoTotal === 0 ? 0 : (videoCompleted / videoTotal) * 100;
  const problemPct = problemTotal === 0 ? 0 : (problemCompleted / problemTotal) * 100;
  return {
    total,
    completed,
    pct,
    videoTotal,
    videoCompleted,
    videoPct,
    problemTotal,
    problemCompleted,
    problemPct,
  };
}

export function DashboardClient() {
  const [completions, setCompletions] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompletions(readCompletions());
    setReady(true);
  }, []);

  const {
    total,
    completed,
    pct,
    videoTotal,
    videoCompleted,
    videoPct,
    problemTotal,
    problemCompleted,
    problemPct,
  } = useMemo(
    () => countStats(dsaData, completions),
    [completions]
  );

  const focusDay = useMemo(
    () => getFocusDay(dsaData, completions),
    [completions]
  );

  const handleReset = useCallback(() => {
    const ok =
      typeof window !== "undefined" &&
      window.confirm(
        "Clear all progress and your written problem notes? This cannot be undone."
      );
    if (!ok) return;
    clearCompletions();
    clearProblemNotes();
    setCompletions({});
  }, []);

  if (!ready) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Total tasks
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Completed
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {completed}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Progress
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-sky-600 dark:text-sky-400">
            {Math.round(pct)}%
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
        <ProgressBar value={pct} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Videos
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {videoCompleted}/{videoTotal}
              </p>
            </div>
            <p className="text-xl font-bold tabular-nums text-sky-600 dark:text-sky-400">
              {Math.round(videoPct)}%
            </p>
          </div>
          <ProgressBar value={videoPct} />
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Problems
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {problemCompleted}/{problemTotal}
              </p>
            </div>
            <p className="text-xl font-bold tabular-nums text-violet-600 dark:text-violet-400">
              {Math.round(problemPct)}%
            </p>
          </div>
          <ProgressBar value={problemPct} />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Day-wise plan
          </h2>
          <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
            {`Jump to any day (1–${MAX_DAY}). The highlighted card is your suggested`}
            &quot;current&quot; day: first day with incomplete tasks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/day/${focusDay}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
          >
            Go to day {focusDay}
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
          >
            Reset progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {dsaData.map(({ day }) => (
          <DayCard key={day} day={day} isCurrent={day === focusDay} />
        ))}
      </div>
    </div>
  );
}
