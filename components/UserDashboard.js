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

function countStats(data, completions) {
  let videoTotal = 0, videoCompleted = 0, problemTotal = 0, problemCompleted = 0;
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
  return { total, completed, pct, videoTotal, videoCompleted, videoPct, problemTotal, problemCompleted, problemPct };
}

function getStreak(completions) {
  let streak = 0;
  for (let d = 1; d <= MAX_DAY; d++) {
    const dayData = dsaData.find((x) => x.day === d);
    if (!dayData) break;
    const done =
      dayData.tasks.every((_, i) => completions[taskKey(d, i)]) &&
      dayData.problems.every((_, i) => completions[problemKey(d, i)]);
    if (done) streak++;
    else break;
  }
  return streak;
}

/* ─── Streak Heatmap ─────────────────────────────────────── */
function StreakHeatmap({ completions, expectedDay }) {
  return (
    <div className="heatmap-grid">
      {dsaData.map(({ day, tasks, problems }) => {
        const done =
          tasks.filter((_, i) => completions[taskKey(day, i)]).length +
          problems.filter((_, i) => completions[problemKey(day, i)]).length;
        const total = tasks.length + problems.length;
        const pct = total === 0 ? 0 : done / total;
        let level = 0;
        if (pct > 0) level = 1;
        if (pct >= 0.5) level = 2;
        if (pct >= 1) level = 3;
        const isToday = day === expectedDay;
        return (
          <div
            key={day}
            className={`heatmap-cell level-${level}${isToday ? " today-cell" : ""}`}
            title={`Day ${day}: ${done}/${total} done${isToday ? " ← Today's target" : ""}`}
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
    return scheduleProgress?.expectedDay ?? focusDay;
  }, [scheduleProgress, focusDay]);

  const expectedCalendarDay = useMemo(() => {
    if (!scheduleProgress || !planId) return 1;
    return getCalendarDayForContentDay(planId, scheduleProgress.expectedDay);
  }, [scheduleProgress, planId]);

  const calendarDays = useMemo(() => {
    return Array.from({ length: totalCalendarDays }, (_, i) => i + 1);
  }, [totalCalendarDays]);

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
        </div>
      </div>

      {/* ── Heatmap ──────────────────────────────── */}
      <div className="db-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <p className="db-card-label">Progress Heatmap — {MAX_DAY} Days</p>
          <span className="heatmap-today-legend">
            <span className="heatmap-cell today-cell" style={{ display: "inline-block", verticalAlign: "middle" }} />
            {" "}= Today&apos;s target (Day {expectedCalendarDay})
          </span>
        </div>
        <StreakHeatmap completions={completions} expectedDay={expectedContentDay} />
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
