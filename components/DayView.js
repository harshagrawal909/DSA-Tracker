"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TaskItem } from "@/components/TaskItem";
import { ProblemItem } from "@/components/ProblemItem";
import {
  readCompletions,
  writeCompletions,
  readProblemNotes,
  writeProblemNotes,
  taskKey,
  problemKey,
  problemNotesKey,
} from "@/lib/storage";

function normalizeProblem(p) {
  if (typeof p === "string") {
    return {
      probId: "",
      title: p,
      link: "",
      difficulty: "",
      platform: "",
      approach: "",
    };
  }
  return {
    probId: String(p.probId ?? "").trim(),
    title: String(p.title ?? "").trim(),
    link: String(p.link ?? "").trim(),
    difficulty: String(p.difficulty ?? "").trim(),
    platform: String(p.platform ?? "").trim(),
    approach: String(p.approach ?? "").trim(),
  };
}

export function DayView({ day, totalDays }) {
  const { day: dayNum, tasks, problems } = day;
  const hasPrev = dayNum > 1;
  const hasNext = totalDays == null || dayNum < totalDays;
  const [completions, setCompletions] = useState({});
  const [problemNotes, setProblemNotes] = useState({});
  const [ready, setReady] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  useEffect(() => {
    setCompletions(readCompletions());
    setProblemNotes(readProblemNotes());
    setReady(true);
  }, []);

  const toggleTask = useCallback(
    (index) => {
      const key = taskKey(dayNum, index);
      setCompletions((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        writeCompletions(next);
        return next;
      });
    },
    [dayNum]
  );

  const toggleProblem = useCallback(
    (index) => {
      const key = problemKey(dayNum, index);
      setCompletions((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        writeCompletions(next);
        return next;
      });
    },
    [dayNum]
  );

  const updateProblemNote = useCallback(
    (index, value) => {
      const key = problemNotesKey(dayNum, index);
      setProblemNotes((prev) => {
        const next = { ...prev, [key]: value };
        writeProblemNotes(next);
        return next;
      });
    },
    [dayNum]
  );

  const normalizedProblems = useMemo(
    () => problems.map((p) => normalizeProblem(p)),
    [problems]
  );

  const visibleTasks = useMemo(() => {
    return tasks
      .map((t, index) => ({ ...t, index }))
      .filter(({ index }) => {
        if (!pendingOnly) return true;
        return !completions[taskKey(dayNum, index)];
      });
  }, [tasks, pendingOnly, completions, dayNum]);

  const visibleProblemEntries = useMemo(() => {
    return normalizedProblems
      .map((problem, index) => ({ problem, index }))
      .filter(({ index }) => {
        if (!pendingOnly) return true;
        return !completions[problemKey(dayNum, index)];
      });
  }, [normalizedProblems, pendingOnly, completions, dayNum]);

  const doneVideos = tasks.filter((_, i) => completions[taskKey(dayNum, i)]).length;
  const doneProblems = problems.filter((_, i) => completions[problemKey(dayNum, i)]).length;

  if (!ready) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back to Dashboard */}
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Day title + progress */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Day {dayNum}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {doneVideos}/{tasks.length} videos completed • {doneProblems}/
          {problems.length} problems completed
        </p>
      </div>

      {/* Navigation bar: Prev — Filter — Next */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev Day */}
        {hasPrev ? (
          <Link
            href={`/day/${dayNum - 1}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            <span>Day {dayNum - 1}</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Filter toggle */}
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/80 p-0.5 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setPendingOnly(false)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              !pendingOnly
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            ].join(" ")}
          >
            Show all
          </button>
          <button
            type="button"
            onClick={() => setPendingOnly(true)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              pendingOnly
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            ].join(" ")}
          >
            Pending
          </button>
        </div>

        {/* Next Day */}
        {hasNext ? (
          <Link
            href={`/day/${dayNum + 1}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
          >
            <span>Day {dayNum + 1}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 11.78a.75.75 0 0 1-1.06-1.06L10.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Video tasks
        </h2>
        {visibleTasks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            No pending videos — switch to &quot;Show all&quot; or pick another day.
          </p>
        ) : (
          <ul className="space-y-3">
            {visibleTasks.map(({ index, title, duration, link }) => (
              <li key={index}>
                <TaskItem
                  title={title}
                  duration={duration}
                  link={link}
                  completed={!!completions[taskKey(dayNum, index)]}
                  onToggle={() => toggleTask(index)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-none">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Problems
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Practice from your sheet (LeetCode, GFG, …). Difficulty and platform
          come from Excel; add your own notes below — they are saved in this
          browser.
        </p>
        {visibleProblemEntries.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            No pending problems — switch to &quot;Show all&quot; or pick another day.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {visibleProblemEntries.map(({ problem, index }) => {
              const nKey = problemNotesKey(dayNum, index);
              return (
                <li key={`${problem.title}-${index}`}>
                  <ProblemItem
                    noteFieldId={`problem-note-${dayNum}-${index}`}
                    probId={problem.probId}
                    title={problem.title}
                    link={problem.link}
                    difficulty={problem.difficulty}
                    platform={problem.platform}
                    sheetApproach={problem.approach}
                    completed={!!completions[problemKey(dayNum, index)]}
                    onToggle={() => toggleProblem(index)}
                    userNote={problemNotes[nKey] ?? ""}
                    onUserNoteChange={(v) => updateProblemNote(index, v)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}