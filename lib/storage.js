export const STORAGE_COMPLETIONS = "dsa-tracker-completions";
export const STORAGE_PROBLEM_NOTES = "dsa-tracker-problem-notes";
export const STORAGE_THEME = "dsa-tracker-theme";

export function readCompletions() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_COMPLETIONS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function writeCompletions(map) {
  window.localStorage.setItem(STORAGE_COMPLETIONS, JSON.stringify(map));
}

export function clearCompletions() {
  window.localStorage.removeItem(STORAGE_COMPLETIONS);
}

export function readProblemNotes() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_PROBLEM_NOTES);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function writeProblemNotes(map) {
  window.localStorage.setItem(STORAGE_PROBLEM_NOTES, JSON.stringify(map));
}

export function clearProblemNotes() {
  window.localStorage.removeItem(STORAGE_PROBLEM_NOTES);
}

export function taskKey(day, index) {
  return `${day}-${index}`;
}

export function problemKey(day, index) {
  return `p-${day}-${index}`;
}

export function problemNotesKey(day, index) {
  return `n-${day}-${index}`;
}
