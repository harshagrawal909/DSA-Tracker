/**
 * Schedule options for the DSA Tracker.
 * Maps a schedule type to the number of curriculum days per calendar week,
 * so we can compute the "expected current day" and projected completion date.
 *
 * The curriculum has MAX_DAY days total (from data.js).
 */

export const SCHEDULE_OPTIONS = [
  {
    id: "1month",
    label: "1 Month – Intensive",
    emoji: "⚡",
    daysPerWeek: 14, // ~2 curriculum days per calendar day
    description: "Hardcore mode. Cover 2 topics/day. Best for full-time prep.",
    color: "#ef4444",
    badge: "Fastest",
    weeks: "~4 weeks",
  },
  {
    id: "2month",
    label: "2 Months – Fast",
    emoji: "🚀",
    daysPerWeek: 7, // 1 curriculum day per calendar day
    description: "One topic per day. Great for dedicated learners with time.",
    color: "#f59e0b",
    badge: "Popular",
    weeks: "~8 weeks",
  },
  {
    id: "3month",
    label: "3 Months – Balanced",
    emoji: "🎯",
    daysPerWeek: 5, // 5 curriculum days per calendar week
    description: "5 days on, 2 days rest. Sustainable and thorough approach.",
    color: "#8b5cf6",
    badge: "Recommended",
    weeks: "~12 weeks",
  },
  {
    id: "6month",
    label: "6 Months – Relaxed",
    emoji: "🌱",
    daysPerWeek: 3, // 3 curriculum days per calendar week
    description: "3 days per week. Perfect for working professionals & students.",
    color: "#10b981",
    badge: "Stress-free",
    weeks: "~20 weeks",
  },
];

const STORAGE_KEY = "dsa-schedule";

/**
 * Save the chosen schedule to localStorage.
 * @param {{ type: string, startDate: string }} schedule
 */
export function saveSchedule(schedule) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
}

/**
 * Read the saved schedule from localStorage.
 * @returns {{ type: string, startDate: string } | null}
 */
export function readSchedule() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Get the schedule option object for a given type id.
 * @param {string} typeId
 */
export function getScheduleOption(typeId) {
  return SCHEDULE_OPTIONS.find((s) => s.id === typeId) ?? SCHEDULE_OPTIONS[2];
}

/**
 * Given a schedule, calculate:
 * - How many calendar days have passed since startDate
 * - Which curriculum day the user *should* be on today
 * - The projected finish date
 *
 * @param {{ type: string, startDate: string }} schedule
 * @param {number} maxDay - total curriculum days
 * @returns {{ expectedDay: number, projectedFinish: Date, calendarDaysElapsed: number }}
 */
export function computeScheduleProgress(schedule, maxDay) {
  const option = getScheduleOption(schedule.type);
  const start = new Date(schedule.startDate);
  const today = new Date();

  // Calendar days elapsed (minimum 0)
  const msPerDay = 1000 * 60 * 60 * 24;
  const calendarDaysElapsed = Math.max(
    0,
    Math.floor((today - start) / msPerDay)
  );

  // Curriculum days per calendar day
  const curriculumPerCalendarDay = option.daysPerWeek / 7;

  // Expected curriculum day today (clamped to maxDay)
  const expectedDay = Math.min(
    maxDay,
    Math.max(1, Math.ceil(calendarDaysElapsed * curriculumPerCalendarDay))
  );

  // Calendar days needed to finish all maxDay curriculum days
  const totalCalendarDays = Math.ceil(maxDay / curriculumPerCalendarDay);
  const projectedFinish = new Date(start.getTime() + totalCalendarDays * msPerDay);

  return { expectedDay, projectedFinish, calendarDaysElapsed, totalCalendarDays };
}

/**
 * Format a date as "DD MMM YYYY"
 * @param {Date} date
 */
export function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
