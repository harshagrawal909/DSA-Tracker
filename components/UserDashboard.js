"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { dsaData, MAX_DAY } from "@/data";
import { ProgressBar } from "@/components/ProgressBar";
import {
  readCompletions,
  clearCompletions,
  clearProblemNotes,
  taskKey,
  problemKey,
} from "@/lib/storage";
import {
  readSchedule,
  saveSchedule,
  getScheduleOption,
  computeScheduleProgress,
  formatDate,
  SCHEDULE_OPTIONS,
} from "@/lib/schedule";
import {
  getPlanId,
  getPlanMaxDay,
  getPlanDay,
  getPlanProgress,
  getCalendarDayForContentDay,
} from "@/planData";


/* ─── Helpers ────────────────────────────────────────────── */
function getFocusDay(data, completions) {
  for (const { day, tasks, problems } of data) {
    const allDone =
      tasks.every((_, i) => completions[taskKey(day, i)]) &&
      problems.every((_, i) => completions[problemKey(day, i)]);
    if (!allDone) return day;
  }
  return data.length > 0 ? data[data.length - 1].day : MAX_DAY;
}

function getTopicForTitle(title, dayNum) {
  const t = String(title || "").toLowerCase();
  
  if (
    t.includes("dp ") || 
    t.includes("dynamic programming") || 
    t.includes("climbing stairs") || 
    t.includes("frog jump") || 
    t.includes("house robber") || 
    t.includes("ninja's training") || 
    t.includes("unique paths") || 
    t.includes("cherry pickup") || 
    t.includes("knapsack") || 
    t.includes("rod cutting") || 
    t.includes("longest common subsequence") || 
    t.includes("lcs") || 
    t.includes("supersequence") || 
    t.includes("edit distance") || 
    t.includes("wildcard matching") || 
    t.includes("longest increasing subsequence") || 
    t.includes("lis") || 
    t.includes("longest string chain") || 
    t.includes("longest bitonic subsequence") || 
    t.includes("matrix chain multiplication") || 
    t.includes("mcm") || 
    t.includes("burst balloons") || 
    t.includes("stick") || 
    t.includes("maximal rectangle") || 
    t.includes("square submatrices") || 
    t.includes(" ninja")
  ) {
    return "Dynamic Programming";
  }
  
  if (
    t.includes("graph") || 
    t.includes("graphs") || 
    t.includes("provinces") || 
    t.includes("islands") || 
    t.includes("flood fill") || 
    t.includes("rotten oranges") || 
    t.includes("cycle in") || 
    t.includes("enclaves") || 
    t.includes("bipartite") || 
    t.includes("topological sort") || 
    t.includes("kahn") || 
    t.includes("course schedule") || 
    t.includes("alien dictionary") || 
    t.includes("shortest path") || 
    t.includes("word ladder") || 
    t.includes("dijkstra") || 
    t.includes("maze") || 
    t.includes("flights") || 
    t.includes("bellman") || 
    t.includes("warshall") || 
    t.includes("spanning tree") || 
    t.includes("prim's") || 
    t.includes("disjoint set") || 
    t.includes("kruskal") || 
    t.includes("dsu") || 
    t.includes("bridges in") || 
    t.includes("tarjan") || 
    t.includes("articulation point") || 
    t.includes("kosaraju") || 
    t.includes("stones removed") || 
    t.includes(" bfs") || 
    t.includes(" dfs") || 
    t.startsWith("bfs") || 
    t.startsWith("dfs")
  ) {
    return "Graphs";
  }

  if (
    t.includes("bst") || 
    t.includes("binary search tree") || 
    t.includes("tree") || 
    t.includes("trees") || 
    t.includes("preorder") || 
    t.includes("inorder") || 
    t.includes("postorder") || 
    t.includes("traversal") || 
    t.includes("identical") || 
    t.includes("zig-zag") || 
    t.includes("zigzag") || 
    t.includes("boundary") || 
    t.includes("vertical view") || 
    t.includes("top view") || 
    t.includes("bottom view") || 
    t.includes("right side view") || 
    t.includes("left side view") || 
    t.includes("symmetrical") || 
    t.includes("lowest common ancestor") || 
    t.includes("lca") || 
    t.includes(" burn ") || 
    t.includes("serialize") || 
    t.includes("morris") || 
    t.includes("ceil in") || 
    t.includes("floor in")
  ) {
    return "Trees & BST";
  }

  if (
    t.includes("linkedlist") || 
    t.includes("linked list") || 
    t.includes("dll") || 
    t.includes(" ll") || 
    t.startsWith("ll") || 
    t.includes("browser history")
  ) {
    return "Linked List";
  }

  if (
    t.includes("stack") || 
    t.includes("queue") || 
    t.includes("parenthes") || 
    t.includes("infix") || 
    t.includes("postfix") || 
    t.includes("prefix") || 
    t.includes("greater element") || 
    t.includes("smaller element") || 
    t.includes("rainwater") || 
    t.includes("trapping rain") || 
    t.includes("histogram") || 
    t.includes("stock span") || 
    t.includes("celebrity problem") || 
    t.includes("lru cache") || 
    t.includes("lfu cache")
  ) {
    return "Stacks & Queues";
  }

  if (
    t.includes("sliding window") || 
    t.includes("2 pointers") || 
    t.includes("two pointers") || 
    t.includes("fruit") || 
    t.includes("subarrays with k") || 
    t.includes("window substring") || 
    t.includes("obtain from cards")
  ) {
    return "Sliding Window & 2 Pointers";
  }

  if (
    t.includes("greedy") || 
    t.includes("sjf") || 
    t.includes("assign cookies") || 
    t.includes("lemonade change") || 
    t.includes("jump game") || 
    t.includes("job sequencing") || 
    t.includes("meeting in") || 
    t.includes("knapsack algorithm") || 
    t.includes("candy")
  ) {
    return "Greedy Algorithms";
  }

  if (
    t.includes("binary search") || 
    t.includes("bs-") || 
    t.includes("bs ") || 
    t.startsWith("bs-") || 
    t.includes("lower bound") || 
    t.includes("upper bound") || 
    t.includes("search insert") || 
    t.includes("koko") || 
    t.includes("aggressive") || 
    t.includes("allocate books") || 
    t.includes("peak element") || 
    t.includes("sqrt") || 
    t.includes("nth root") || 
    t.includes("rotated")
  ) {
    return "Binary Search";
  }

  if (t.includes("recursion") || t.includes("fibonacci") || t.includes("pow(")) {
    return "Recursion";
  }

  if (
    t.includes("maths") || 
    t.includes("divisors") || 
    t.includes("prime") || 
    t.includes("sieve") || 
    t.includes("eratosthenes") || 
    t.includes("exponentiation") || 
    t.includes("euclidean")
  ) {
    return "Basic Maths";
  }

  if (t.includes("sorting") || t.includes("sort") || t.includes("merge") || t.includes("quick")) {
    return "Sorting";
  }

  if (t.includes("hashing") || t.includes("anagram")) {
    return "Hashing";
  }

  if (
    t.includes("array") || 
    t.includes("arrays") || 
    t.includes("matrix") || 
    t.includes("spiral") || 
    t.includes("kadane") || 
    t.includes("subarray") || 
    t.includes("subarrays") || 
    t.includes("rotate") || 
    t.includes("pascal") || 
    t.includes("3sum") || 
    t.includes("4sum") || 
    t.includes("xor") || 
    t.includes("duplicate") || 
    t.includes("inversion") || 
    t.includes("reverse pairs") || 
    t.includes("two sum") || 
    t.includes("majority element") || 
    t.includes("stock")
  ) {
    return "Arrays";
  }

  if (dayNum >= 1 && dayNum <= 3) return "Basics & STL";
  if (dayNum >= 56 && dayNum <= 61) return "Buffer & Revision";

  return "Basics & STL";
}

function countStats(data, completions) {
  let videoTotal = 0, videoCompleted = 0, problemTotal = 0, problemCompleted = 0;
  let easyTotal = 0, easyCompleted = 0;
  let mediumTotal = 0, mediumCompleted = 0;
  let hardTotal = 0, hardCompleted = 0;
  const topicStats = {};

  for (const { day, tasks, problems } of data) {
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const topic = t.category || getTopicForTitle(t.title, day);
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, completed: 0 };
      }
      topicStats[topic].total++;
      if (completions[taskKey(day, i)]) {
        topicStats[topic].completed++;
      }
    }

    videoTotal += tasks.length;
    videoCompleted += tasks.filter((_, i) => completions[taskKey(day, i)]).length;
    
    problemTotal += problems.length;
    problemCompleted += problems.filter((_, i) => completions[problemKey(day, i)]).length;

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      const diff = String(p.difficulty || "Easy").trim().toLowerCase();
      const isDone = !!completions[problemKey(day, i)];
      
      if (diff === "easy") {
        easyTotal++;
        if (isDone) easyCompleted++;
      } else if (diff === "medium" || diff === "med") {
        mediumTotal++;
        if (isDone) mediumCompleted++;
      } else if (diff === "hard") {
        hardTotal++;
        if (isDone) hardCompleted++;
      } else {
        easyTotal++;
        if (isDone) easyCompleted++;
      }
    }
  }
  const total = videoTotal + problemTotal;
  const completed = videoCompleted + problemCompleted;
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const videoPct = videoTotal === 0 ? 0 : (videoCompleted / videoTotal) * 100;
  const problemPct = problemTotal === 0 ? 0 : (problemCompleted / problemTotal) * 100;
  
  return { 
    total, completed, pct, 
    videoTotal, videoCompleted, videoPct, 
    problemTotal, problemCompleted, problemPct,
    easyTotal, easyCompleted,
    mediumTotal, mediumCompleted,
    hardTotal, hardCompleted,
    topicStats
  };
}

function getStreak(completions) {
  if (!completions) return 0;

  const activeDates = new Set();
  
  for (const key in completions) {
    const val = completions[key];
    if (val) {
      if (typeof val === "string") {
        try {
          const dateStr = val.split("T")[0]; // Extract YYYY-MM-DD
          if (dateStr) activeDates.add(dateStr);
        } catch {
          // Ignore invalid timestamps
        }
      } else if (val === true) {
        // Fallback for legacy completions: treat as active today to preserve streak
        const todayStr = new Date().toISOString().split("T")[0];
        activeDates.add(todayStr);
      }
    }
  }

  if (activeDates.size === 0) return 0;

  let streak = 0;
  
  // Format local date as YYYY-MM-DD
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  let checkDate = new Date();
  
  const todayStr = formatDateLocal(checkDate);
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterdayStr = formatDateLocal(checkDate);

  // If user hasn't solved anything today or yesterday, streak is 0
  if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
    return 0;
  }

  checkDate = new Date(); // Start from today
  while (true) {
    const dateStr = formatDateLocal(checkDate);
    if (activeDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If we are checking today's date and today is not active yet, skip today and look at yesterday
      const isCheckingToday = formatDateLocal(new Date()) === dateStr;
      if (isCheckingToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return streak;
}

/* ─── Streak Heatmap ─────────────────────────────────────── */
function StreakHeatmap({ planId, completions, expectedCalendarDay }) {
  const totalCalendarDays = getPlanMaxDay(planId);
  const calendarDays = useMemo(() => {
    return Array.from({ length: totalCalendarDays }, (_, i) => i + 1);
  }, [totalCalendarDays]);

  return (
    <div className="heatmap-grid">
      {calendarDays.map((dayNum) => {
        const calendarDay = getPlanDay(planId, dayNum);
        if (!calendarDay) return null;

        const isToday = dayNum === expectedCalendarDay;

        if (calendarDay.type === "rest") {
          const isPast = dayNum < expectedCalendarDay;
          return (
            <div
              key={dayNum}
              className={`heatmap-cell rest-cell ${isPast ? "rest-done" : ""}${isToday ? " today-cell" : ""}`}
              title={`Day ${dayNum} (Rest Day)${isToday ? " ← Today's target" : ""}`}
              style={{
                backgroundColor: isPast ? "rgba(16, 185, 129, 0.4)" : "rgba(100, 116, 139, 0.15)",
                border: isToday ? "2px solid #8b5cf6" : "1px dashed rgba(148, 163, 184, 0.25)"
              }}
            />
          );
        }

        let total = 0;
        let done = 0;
        if (calendarDay.tasks) {
          total += calendarDay.tasks.length;
          done += calendarDay.tasks.filter((t) => completions[taskKey(t.contentDay, t.originalIndex)]).length;
        }
        if (calendarDay.problems) {
          total += calendarDay.problems.length;
          done += calendarDay.problems.filter((p) => completions[problemKey(p.contentDay, p.originalIndex)]).length;
        }

        const pct = total === 0 ? 0 : done / total;
        let level = 0;
        if (pct > 0) level = 1;
        if (pct >= 0.5) level = 2;
        if (pct >= 1) level = 3;

        return (
          <div
            key={dayNum}
            className={`heatmap-cell level-${level}${isToday ? " today-cell" : ""}`}
            title={`Day ${dayNum}: ${done}/${total} done${isToday ? " ← Today's target" : ""}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Schedule Banner ────────────────────────────────────── */
function ScheduleBanner({ schedule, expectedCalendarDay, onChangeSchedule }) {
  const opt = getScheduleOption(schedule.type);
  const { projectedFinish, calendarDaysElapsed } =
    computeScheduleProgress(schedule, MAX_DAY);

  return (
    <div className="schedule-banner" style={{ "--opt-color": opt.color }}>
      <div className="schedule-banner-left">
        <span className="sched-emoji">{opt.emoji}</span>
        <div>
          <p className="sched-label">{opt.label}</p>
          <p className="sched-sub">
            Day {calendarDaysElapsed} of your journey •{" "}
            Projected finish: {formatDate(projectedFinish)}
          </p>
        </div>
      </div>
      <div className="schedule-banner-right">
        <div className="sched-target">
          Target today: <strong>Day {expectedCalendarDay}</strong>
        </div>
        <button className="btn-change-sched" onClick={onChangeSchedule}>
          Change Pace
        </button>
      </div>
    </div>
  );
}

/* ─── Change Schedule Modal ──────────────────────────────── */
function ChangeScheduleModal({ currentType, onSave, onClose }) {
  const [selected, setSelected] = useState(currentType);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const updated = { type: selected, startDate: today };
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule: updated })
      });
      if (res.ok) {
        onSave(updated);
      } else {
        alert("Failed to save schedule to database.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving schedule.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="change-sched-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Change Study Pace</h2>
            <p className="modal-subtitle">Resets your start date to today</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="change-sched-list">
          {SCHEDULE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`change-sched-item ${selected === opt.id ? "selected" : ""}`}
              onClick={() => setSelected(opt.id)}
              style={{ "--opt-color": opt.color }}
            >
              <span className="opt-emoji">{opt.emoji}</span>
              <div className="flex-1">
                <p className="opt-label-sm">{opt.label}</p>
                <p className="opt-weeks-sm">{opt.weeks}</p>
              </div>
              {selected === opt.id && (
                <span style={{ color: opt.color, fontWeight: 700 }}>✓</span>
              )}
            </button>
          ))}
        </div>
        <button
          className="btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="btn-spinner" /> : "Save New Pace"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export function UserDashboard() {
  const { data: session } = useSession();
  const [completions, setCompletions] = useState({});
  const [ready, setReady] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [showChangeSchedule, setShowChangeSchedule] = useState(false);
  const [showProblemDetails, setShowProblemDetails] = useState(false);
  const [showVideoDetails, setShowVideoDetails] = useState(false);

  useEffect(() => {
    setCompletions(readCompletions());
    
    // Load schedule & completions from Firestore
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.schedule) {
            setSchedule(data.schedule);
          } else {
            const sessionSchedule = session?.user?.schedule;
            setSchedule(
              sessionSchedule ?? { type: "3month", startDate: new Date().toISOString().split("T")[0] }
            );
          }
          if (data.completions) {
            setCompletions(data.completions);
            window.localStorage.setItem("dsa-tracker-completions", JSON.stringify(data.completions));
          }
          if (data.problemNotes) {
            window.localStorage.setItem("dsa-tracker-problem-notes", JSON.stringify(data.problemNotes));
          }
        } else {
          setSchedule({ type: "3month", startDate: new Date().toISOString().split("T")[0] });
        }
        setReady(true);
      })
      .catch((err) => {
        console.error("Error loading user data:", err);
        setSchedule({ type: "3month", startDate: new Date().toISOString().split("T")[0] });
        setReady(true);
      });
  }, [session]);

  const stats = useMemo(() => countStats(dsaData, completions), [completions]);
  const focusDay = useMemo(() => getFocusDay(dsaData, completions), [completions]);
  const streak = useMemo(() => getStreak(completions), [completions]);

  const scheduleProgress = useMemo(() => {
    if (!schedule) return null;
    return computeScheduleProgress(schedule, MAX_DAY);
  }, [schedule]);

  const planId = useMemo(() => getPlanId(schedule?.type), [schedule]);
  const totalCalendarDays = useMemo(() => getPlanMaxDay(planId), [planId]);

  const focusCalendarDay = useMemo(() => {
    if (!planId) return 1;
    return getCalendarDayForContentDay(planId, focusDay);
  }, [planId, focusDay]);

  const expectedContentDay = useMemo(() => {
    return focusDay;
  }, [focusDay]);

  const expectedCalendarDay = useMemo(() => {
    if (!planId) return 1;
    return getCalendarDayForContentDay(planId, focusDay);
  }, [planId, focusDay]);

  const calendarDays = useMemo(() => {
    const days = Array.from({ length: totalCalendarDays }, (_, i) => i + 1);
    if (!planId) return days;

    const isDayCompleted = (dayNum) => {
      const calendarDay = getPlanDay(planId, dayNum);
      if (!calendarDay) return false;
      if (calendarDay.type === "rest") {
        return dayNum < focusCalendarDay;
      }
      
      let total = 0;
      let done = 0;
      if (calendarDay.tasks) {
        total += calendarDay.tasks.length;
      }
      if (calendarDay.problems) {
        total += calendarDay.problems.length;
      }
      
      // Calculate completions
      if (calendarDay.tasks) {
        done += calendarDay.tasks.filter((t) => completions[taskKey(t.contentDay, t.originalIndex)]).length;
      }
      if (calendarDay.problems) {
        done += calendarDay.problems.filter((p) => completions[problemKey(p.contentDay, p.originalIndex)]).length;
      }

      return total > 0 && done === total;
    };

    return [...days].sort((a, b) => {
      const aDone = isDayCompleted(a);
      const bDone = isDayCompleted(b);
      if (aDone && !bDone) return 1;
      if (!aDone && bDone) return -1;
      return a - b;
    });
  }, [totalCalendarDays, planId, completions, focusCalendarDay]);

  const handleReset = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Clear all progress and notes? This cannot be undone.")
    ) {
      clearCompletions();
      clearProblemNotes();
      setCompletions({});
    }
  }, []);

  if (!ready || !schedule) {
    return (
      <div className="dashboard-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    );
  }

  const user = session?.user;
  const expectedDay = scheduleProgress?.expectedDay ?? focusDay;

  return (
    <div className="user-dashboard">
      {/* ── Top Header Navigation ──────────────────── */}
      <header className="db-top-nav-bar">
        <div className="db-nav-brand" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icon.png" alt="AlgoPath" style={{ height: "26px", width: "26px", borderRadius: "6px" }} />
          <span className="db-nav-title" style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff" }}>AlgoPath</span>
        </div>
        <div className="db-nav-actions">
          {user && (
            <Link href="/dashboard/profile" className="db-nav-profile-btn" title="View Profile">
              <Image
                src={user.image}
                alt={user.name}
                width={28}
                height={28}
                className="db-nav-avatar"
              />
              <span className="db-nav-username">View Profile</span>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="db-nav-admin-btn">
              🛡️ Admin
            </Link>
          )}
          <button
            className="db-nav-signout"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* ── Schedule Banner ────────────────────────── */}
      <ScheduleBanner
        schedule={schedule}
        expectedCalendarDay={expectedCalendarDay}
        onChangeSchedule={() => setShowChangeSchedule(true)}
      />

      {/* ── Summary Cards ──────────────────────────── */}
      <div className="db-stat-grid">
        <div className="db-stat-card">
          <p className="db-stat-label">Total Tasks</p>
          <p className="db-stat-value">{stats.total}</p>
        </div>
        <div className="db-stat-card">
          <p className="db-stat-label">Completed</p>
          <p className="db-stat-value" style={{ color: "#34d399" }}>{stats.completed}</p>
        </div>
        <div className="db-stat-card">
          <p className="db-stat-label">Progress</p>
          <p className="db-stat-value" style={{ color: "#38bdf8" }}>{Math.round(stats.pct)}%</p>
        </div>
        <div className="db-stat-card">
          <p className="db-stat-label">Streak</p>
          <p className="db-stat-value" style={{ color: "#fb923c" }}>🔥 {streak}</p>
        </div>
      </div>

      {/* ── Progress Bar ──────────────────────────── */}
      <div className="db-card">
        <p className="db-card-label mb-3">Overall Progress</p>
        <ProgressBar value={stats.pct} />
      </div>

      {/* ── Videos & Problems ─────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#fff", margin: 0 }}>Videos &amp; Problems Progress</h3>
        <button
          onClick={() => {
            const nextState = !(showVideoDetails && showProblemDetails);
            setShowVideoDetails(nextState);
            setShowProblemDetails(nextState);
          }}
          style={{
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            color: "#a78bfa",
            fontSize: "0.75rem",
            fontWeight: "700",
            cursor: "pointer",
            padding: "0.35rem 0.75rem",
            borderRadius: "0.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            transition: "all 0.2s ease"
          }}
        >
          {showVideoDetails && showProblemDetails ? "Hide All Details 📊" : "Show All Details 📊"}
        </button>
      </div>

      <div className="db-split-grid">
        <div className="db-card">
          <div className="db-split-header">
            <div>
              <p className="db-card-label">Videos</p>
              <p className="db-split-count">{stats.videoCompleted}/{stats.videoTotal}</p>
            </div>
            <p className="db-split-pct" style={{ color: "#38bdf8" }}>{Math.round(stats.videoPct)}%</p>
          </div>
          <ProgressBar value={stats.videoPct} />


          {showVideoDetails && (
            <div style={{ 
              marginTop: "0.75rem", 
              paddingTop: "0.75rem", 
              borderTop: "1px solid rgba(255,255,255,0.06)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem",
              fontSize: "0.8rem",
              animation: "fadeIn 0.2s ease"
            }}>
              {Object.entries(stats.topicStats || {})
                .map(([name, { total, completed }]) => {
                  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
                  return { name, pct };
                })
                .filter((t) => t.pct > 0)
                .sort((a, b) => b.pct - a.pct)
                .map((topic) => (
                  <div key={topic.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#cbd5e1", fontWeight: "600" }}>{topic.name}</span>
                    <span style={{ color: "#38bdf8", fontWeight: "700" }}>{topic.pct}% completed</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <div className="db-card">
          <div className="db-split-header">
            <div>
              <p className="db-card-label">Problems</p>
              <p className="db-split-count">{stats.problemCompleted}/{stats.problemTotal}</p>
            </div>
            <p className="db-split-pct" style={{ color: "#a78bfa" }}>{Math.round(stats.problemPct)}%</p>
          </div>
          <ProgressBar value={stats.problemPct} />
          

          {showProblemDetails && (
            <div style={{ 
              marginTop: "0.75rem", 
              paddingTop: "0.75rem", 
              borderTop: "1px solid rgba(255,255,255,0.06)", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.4rem",
              fontSize: "0.8rem",
              animation: "fadeIn 0.2s ease"
            }}>
              {/* Easy Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#10b981", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
                  Easy
                </span>
                <span style={{ color: "#cbd5e1" }}>{stats.easyCompleted} / {stats.easyTotal} solved</span>
              </div>
              {/* Medium Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#f59e0b", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }}></span>
                  Medium
                </span>
                <span style={{ color: "#cbd5e1" }}>{stats.mediumCompleted} / {stats.mediumTotal} solved</span>
              </div>
              {/* Hard Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#ef4444", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }}></span>
                  Hard
                </span>
                <span style={{ color: "#cbd5e1" }}>{stats.hardCompleted} / {stats.hardTotal} solved</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Heatmap ──────────────────────────────── */}
      <div className="db-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p className="db-card-label">Progress Heatmap — {totalCalendarDays} Days</p>
          <span className="heatmap-today-legend">
            <span className="heatmap-cell today-cell" style={{ display: "inline-block", verticalAlign: "middle" }} />
            {" "}= Today&apos;s target (Day {expectedCalendarDay})
          </span>
        </div>
        <StreakHeatmap planId={planId} completions={completions} expectedCalendarDay={expectedCalendarDay} />
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="heatmap-cell level-0" />
          <div className="heatmap-cell level-1" />
          <div className="heatmap-cell level-2" />
          <div className="heatmap-cell level-3" />
          <span>More</span>
        </div>
      </div>

      {/* ── Day Plan Header ────────────────────────── */}
      <div className="db-day-header">
        <div>
          <h2 className="db-day-title">Day-wise Plan</h2>
          <p className="db-day-sub">
            Jump to any day (1–{totalCalendarDays}). 🎯 = today&apos;s target · ✅ = completed
          </p>
        </div>
        <div className="db-day-actions">
          <Link
            href={`/dashboard/day/${focusCalendarDay}`}
            className="btn-primary btn-sm"
          >
            Resume Day {focusCalendarDay} →
          </Link>
          <button type="button" onClick={handleReset} className="btn-danger btn-sm">
            Reset
          </button>
        </div>
      </div>

      {/* ── Day Cards ─────────────────────────────── */}
      <div className="day-cards-grid">
        {calendarDays.map((dayNum) => {
          const calendarDay = getPlanDay(planId, dayNum);
          if (!calendarDay) return null;

          const isTarget = dayNum === expectedCalendarDay;
          const isFocus = dayNum === focusCalendarDay;

          if (calendarDay.type === "rest") {
            return (
              <div
                key={dayNum}
                className="day-card-link rest-day-card"
              >
                <div
                  className={[
                    "day-card-inner-new rest",
                    isFocus ? "focus" : "",
                    isTarget ? "target" : "",
                  ].join(" ")}
                  style={{
                    background: "rgba(30, 41, 59, 0.4)",
                    border: "1px dashed rgba(148, 163, 184, 0.2)",
                    opacity: 0.85
                  }}
                >
                  <div className="day-card-header">
                    <span className="day-card-title" style={{ color: "#94a3b8" }}>Day {dayNum}</span>
                    <span className="status-badge rest" style={{ background: "rgba(100, 116, 139, 0.2)", color: "#94a3b8" }}>☕ Rest Day</span>
                  </div>
                  <div className="day-card-stats-row" style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                    <span>Take a break and recharge!</span>
                  </div>
                </div>
              </div>
            );
          }

          // Study day: calculate completions across merged contentDays
          let total = 0;
          let done = 0;
          
          if (calendarDay.tasks) {
            total += calendarDay.tasks.length;
            done += calendarDay.tasks.filter((t) => completions[taskKey(t.contentDay, t.originalIndex)]).length;
          }
          if (calendarDay.problems) {
            total += calendarDay.problems.length;
            done += calendarDay.problems.filter((p) => completions[problemKey(p.contentDay, p.originalIndex)]).length;
          }

          const isCompleted = done === total && total > 0;

          return (
            <Link
              key={dayNum}
              href={`/dashboard/day/${dayNum}`}
              className="day-card-link"
            >
              <div
                className={[
                  "day-card-inner-new",
                  isCompleted ? "completed" : "",
                  isFocus ? "focus" : "",
                  isTarget ? "target" : "",
                ].join(" ")}
              >
                <div className="day-card-header">
                  <span className="day-card-title">Day {dayNum}</span>
                  {isCompleted && <span className="status-badge success">✅ Done</span>}
                  {!isCompleted && isFocus && <span className="status-badge focus">▶ Active</span>}
                  {!isCompleted && isTarget && !isFocus && <span className="status-badge target">🎯 Target</span>}
                </div>
                
                <div className="day-card-stats-row">
                  <span>{done}/{total} solved</span>
                  <span>{Math.round(total ? (done / total) * 100 : 0)}%</span>
                </div>

                <div className="day-card-progress-bg">
                  <div 
                    className="day-card-progress-bar" 
                    style={{ 
                      width: `${total ? (done / total) * 100 : 0}%`,
                      backgroundColor: isCompleted ? "#10b981" : isFocus ? "#8b5cf6" : "#3b82f6"
                    }} 
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Change Schedule Modal ───────────────────── */}
      {showChangeSchedule && (
        <ChangeScheduleModal
          currentType={schedule.type}
          onSave={(newSched) => {
            setSchedule(newSched);
            setShowChangeSchedule(false);
          }}
          onClose={() => setShowChangeSchedule(false)}
        />
      )}
    </div>
  );
}
