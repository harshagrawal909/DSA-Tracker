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
import { getPlanId, getPlanDay, getPlanMaxDay } from "@/planData";

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

export function DayView({ dayNum, basePath = "/dashboard/day" }) {
  const [schedule, setSchedule] = useState(null);
  const [completions, setCompletions] = useState({});
  const [problemNotes, setProblemNotes] = useState({});
  const [ready, setReady] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  const syncToCloud = useCallback(async (completionsUpdate, notesUpdate) => {
    try {
      const payload = {};
      if (completionsUpdate) payload.completions = completionsUpdate;
      if (notesUpdate) payload.problemNotes = notesUpdate;
      await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Cloud sync failed:", err);
    }
  }, []);

  useEffect(() => {
    // 1. Initial load from local storage
    const localCompletions = readCompletions();
    const localNotes = readProblemNotes();
    setCompletions(localCompletions);
    setProblemNotes(localNotes);

    // 2. Fetch fresh updates from Firestore cloud
    fetch("/api/users/me")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data) {
          if (data.schedule) {
            setSchedule(data.schedule);
          } else {
            setSchedule({ type: "3month", startDate: new Date().toISOString().split("T")[0] });
          }
          if (data.completions) {
            setCompletions(data.completions);
            writeCompletions(data.completions);
          }
          if (data.problemNotes) {
            setProblemNotes(data.problemNotes);
            writeProblemNotes(data.problemNotes);
          }
        } else {
          setSchedule({ type: "3month", startDate: new Date().toISOString().split("T")[0] });
        }
        setReady(true);
      })
      .catch((err) => {
        console.error("Error refreshing day data:", err);
        setSchedule({ type: "3month", startDate: new Date().toISOString().split("T")[0] });
        setReady(true);
      });
  }, []);

  const planId = useMemo(() => getPlanId(schedule?.type), [schedule]);
  const resolvedDay = useMemo(() => getPlanDay(planId, dayNum), [planId, dayNum]);
  const totalDays = useMemo(() => getPlanMaxDay(planId), [planId]);

  const hasPrev = dayNum > 1;
  const hasNext = dayNum < totalDays;

  const toggleTask = useCallback(
    (contentDay, originalIndex) => {
      const key = taskKey(contentDay, originalIndex);
      setCompletions((prev) => {
        const isCurrentlyCompleted = !!prev[key];
        const next = { ...prev, [key]: !isCurrentlyCompleted ? new Date().toISOString() : false };
        writeCompletions(next);
        syncToCloud(next, null);
        return next;
      });
    },
    [syncToCloud]
  );

  const toggleProblem = useCallback(
    (contentDay, originalIndex) => {
      const key = problemKey(contentDay, originalIndex);
      setCompletions((prev) => {
        const isCurrentlyCompleted = !!prev[key];
        const next = { ...prev, [key]: !isCurrentlyCompleted ? new Date().toISOString() : false };
        writeCompletions(next);
        syncToCloud(next, null);
        return next;
      });
    },
    [syncToCloud]
  );

  const updateProblemNote = useCallback(
    (contentDay, originalIndex, value) => {
      const key = problemNotesKey(contentDay, originalIndex);
      setProblemNotes((prev) => {
        const next = { ...prev, [key]: value };
        writeProblemNotes(next);
        syncToCloud(null, next);
        return next;
      });
    },
    [syncToCloud]
  );

  const tasks = useMemo(() => resolvedDay?.tasks || [], [resolvedDay]);
  const problems = useMemo(() => resolvedDay?.problems || [], [resolvedDay]);

  const normalizedProblems = useMemo(
    () => problems.map((p) => ({ ...normalizeProblem(p), contentDay: p.contentDay, originalIndex: p.originalIndex })),
    [problems]
  );

  const visibleTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!pendingOnly) return true;
        return !completions[taskKey(t.contentDay, t.originalIndex)];
      });
  }, [tasks, pendingOnly, completions]);

  const visibleProblemEntries = useMemo(() => {
    return normalizedProblems
      .filter((p) => {
        if (!pendingOnly) return true;
        return !completions[problemKey(p.contentDay, p.originalIndex)];
      });
  }, [normalizedProblems, pendingOnly, completions]);

  const doneVideos = useMemo(() => tasks.filter((t) => completions[taskKey(t.contentDay, t.originalIndex)]).length, [tasks, completions]);
  const doneProblems = useMemo(() => problems.filter((p) => completions[problemKey(p.contentDay, p.originalIndex)]).length, [problems, completions]);

  if (!ready || !schedule || !resolvedDay) {
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
          href="/dashboard"
          className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Day title + progress */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Day {dayNum} {resolvedDay.type === "rest" && "☕"}
        </h1>
        {resolvedDay.type === "rest" ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Recharge day • Take a break, relax your mind, and absorb what you&apos;ve learned!
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {doneVideos}/{tasks.length} videos completed • {doneProblems}/
            {problems.length} problems completed
          </p>
        )}
      </div>

      {/* Navigation bar: Prev — Filter — Next */}
      <div className="flex items-center justify-between gap-3">
        {/* Prev Day */}
        {hasPrev ? (
          <Link
            href={`${basePath}/${dayNum - 1}`}
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
        {resolvedDay.type === "study" && (
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
        )}

        {/* Next Day */}
        {hasNext ? (
          <Link
            href={`${basePath}/${dayNum + 1}`}
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

      {resolvedDay.type === "rest" ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <span style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>☕</span>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Rest Day</h3>
          <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Great coding consists of both active practice and rest. Taking time off lets your brain solidify new algorithms and patterns. Grab a tea, go for a walk, or play some games!
          </p>
        </div>
      ) : (
        <>
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
                {visibleTasks.map((t) => (
                  <li key={`${t.contentDay}-${t.originalIndex}`}>
                    <TaskItem
                      title={t.title}
                      duration={t.duration}
                      link={t.link}
                      completed={!!completions[taskKey(t.contentDay, t.originalIndex)]}
                      onToggle={() => toggleTask(t.contentDay, t.originalIndex)}
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
                {visibleProblemEntries.map((problem) => {
                  const nKey = problemNotesKey(problem.contentDay, problem.originalIndex);
                  return (
                    <li key={`${problem.title}-${problem.contentDay}-${problem.originalIndex}`}>
                      <ProblemItem
                        noteFieldId={`problem-note-${problem.contentDay}-${problem.originalIndex}`}
                        probId={problem.probId}
                        title={problem.title}
                        link={problem.link}
                        difficulty={problem.difficulty}
                        platform={problem.platform}
                        sheetApproach={problem.approach}
                        completed={!!completions[problemKey(problem.contentDay, problem.originalIndex)]}
                        onToggle={() => toggleProblem(problem.contentDay, problem.originalIndex)}
                        userNote={problemNotes[nKey] ?? ""}
                        onUserNoteChange={(v) => updateProblemNote(problem.contentDay, problem.originalIndex, v)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}