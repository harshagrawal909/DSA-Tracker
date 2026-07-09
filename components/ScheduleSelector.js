"use client";

import { useState } from "react";
import {
  SCHEDULE_OPTIONS,
  saveSchedule,
  computeScheduleProgress,
  formatDate,
} from "@/lib/schedule";
import { MAX_DAY } from "@/data";

export function ScheduleSelector({ onSelect }) {
  const [selected, setSelected] = useState("3month");
  const [confirming, setConfirming] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Preview projected finish date for the currently hovered/selected option
  const previewFinish = (typeId) => {
    const { projectedFinish } = computeScheduleProgress(
      { type: typeId, startDate: today },
      MAX_DAY
    );
    return formatDate(projectedFinish);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    const schedule = { type: selected, startDate: today };
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule })
      });
      if (res.ok) {
        onSelect(schedule);
      } else {
        alert("Failed to save schedule to database. Please try again.");
        setConfirming(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
      setConfirming(false);
    }
  };

  return (
    <div className="schedule-overlay">
      <div className="schedule-modal">
        {/* Header */}
        <div className="schedule-header">
          <div className="schedule-icon">📅</div>
          <h2 className="schedule-title">Choose Your Study Pace</h2>
          <p className="schedule-subtitle">
            Pick a schedule that fits your lifestyle. You can always adjust
            later from your dashboard.
          </p>
        </div>

        {/* Options grid */}
        <div className="schedule-grid">
          {SCHEDULE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`schedule-option ${selected === opt.id ? "selected" : ""}`}
              onClick={() => setSelected(opt.id)}
              style={{
                "--opt-color": opt.color,
              }}
              id={`schedule-${opt.id}`}
            >
              <div className="opt-top">
                <span className="opt-emoji">{opt.emoji}</span>
                <span
                  className="opt-badge"
                  style={{ background: opt.color + "22", color: opt.color, border: `1px solid ${opt.color}44` }}
                >
                  {opt.badge}
                </span>
              </div>
              <p className="opt-label">{opt.label}</p>
              <p className="opt-desc">{opt.description}</p>
              <div className="opt-footer">
                <span className="opt-weeks">{opt.weeks}</span>
                <span className="opt-finish">
                  Finish by {previewFinish(opt.id)}
                </span>
              </div>
              {selected === opt.id && (
                <div
                  className="opt-check"
                  style={{ background: opt.color }}
                >
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <div className="schedule-confirm-area">
          <button
            className="btn-primary btn-lg schedule-confirm-btn"
            onClick={handleConfirm}
            disabled={confirming}
            id="confirm-schedule-btn"
          >
            {confirming ? (
              <span className="btn-spinner" />
            ) : (
              <>Start My Journey →</>
            )}
          </button>
          <p className="schedule-note">
            Starting today · {MAX_DAY} curriculum days total · Pace adjustable anytime
          </p>
        </div>
      </div>
    </div>
  );
}
