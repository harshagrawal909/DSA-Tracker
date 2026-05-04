/**
 * Reads Strivers_A2Z_DSA_Schedule.xlsx → writes ../data.js
 * Sheets: 📅 Schedule (videos), 🔢 LeetCode (practice)
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const ROOT = path.join(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "Strivers_A2Z_DSA_Schedule.xlsx");
const OUT_PATH = path.join(ROOT, "data.js");

function slugifyTitle(title) {
  return String(title || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/&amp;/gi, "")
    .replace(/&/g, "and")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function problemLink(platform, title) {
  const p = String(platform || "").toLowerCase();
  const slug = slugifyTitle(title);
  if (!slug) return "";
  if (p.includes("leetcode"))
    return `https://leetcode.com/problems/${slug}/`;
  /* GFG URLs vary — leave blank or paste your own links in Excel later */
  return "";
}

function getSheets(wb) {
  const names = wb.SheetNames;
  const schedule =
    names.find((n) => n.includes("Schedule")) || names[1];
  const lc = names.find((n) => n.includes("LeetCode")) || names[2];
  return { schedule, lc };
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error("Missing file:", XLSX_PATH);
    process.exit(1);
  }

  const wb = XLSX.readFile(XLSX_PATH);
  const { schedule: scheduleName, lc: lcName } = getSheets(wb);

  const scheduleRows = XLSX.utils.sheet_to_json(wb.Sheets[scheduleName], {
    header: 1,
    defval: "",
  });

  const tasksByDay = {};
  for (let i = 2; i < scheduleRows.length; i += 1) {
    const row = scheduleRows[i];
    const day = row[0];
    if (typeof day !== "number" || day < 1) continue;

    const videoNum = row[3];
    const duration = String(row[4] ?? "").trim() || "—";
    const title = String(row[6] ?? "").trim();
    const link = String(row[8] ?? "").trim();

    if (!title) continue;

    if (!tasksByDay[day]) tasksByDay[day] = [];
    tasksByDay[day].push({
      videoNum: typeof videoNum === "number" ? videoNum : Number(videoNum) || 0,
      title,
      duration,
      link,
    });
  }

  Object.keys(tasksByDay).forEach((d) => {
    tasksByDay[d].sort((a, b) => a.videoNum - b.videoNum);
    tasksByDay[d] = tasksByDay[d].map(({ title, duration, link }) => ({
      title,
      duration,
      link,
    }));
  });

  const lcRows = XLSX.utils.sheet_to_json(wb.Sheets[lcName], {
    header: 1,
    defval: "",
  });

  const problemsByDay = {};
  for (let i = 2; i < lcRows.length; i += 1) {
    const row = lcRows[i];
    const day = row[0];
    if (typeof day !== "number" || day < 1) continue;

    const probId = String(row[2] ?? "").trim();
    const title = String(row[3] ?? "").trim();
    const difficulty = String(row[4] ?? "").trim();
    const platform = String(row[6] ?? "").trim();
    const approach = String(row[7] ?? "").trim();

    if (!title) continue;

    if (!problemsByDay[day]) problemsByDay[day] = [];
    problemsByDay[day].push({
      probId,
      title,
      difficulty,
      platform,
      approach,
      link: problemLink(platform, title),
    });
  }

  const dayKeys = [
    ...Object.keys(tasksByDay).map(Number),
    ...Object.keys(problemsByDay).map(Number),
  ];
  const MAX_DAY =
    dayKeys.length > 0 ? Math.max(...dayKeys) : 61;

  const dsaData = [];
  for (let d = 1; d <= MAX_DAY; d += 1) {
    dsaData.push({
      day: d,
      tasks: tasksByDay[d] ?? [],
      problems: problemsByDay[d] ?? [],
    });
  }

  const escaped = JSON.stringify(dsaData, null, 2)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  const file = `/** Auto-generated from Strivers_A2Z_DSA_Schedule.xlsx — run npm run data:import */
export const MAX_DAY = ${MAX_DAY};

export const dsaData = ${escaped};

export function getDayById(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1 || n > MAX_DAY) return null;
  return dsaData.find((d) => d.day === n) ?? null;
}
`;

  fs.writeFileSync(OUT_PATH, file, "utf8");
  console.log("Wrote", OUT_PATH);
  console.log("MAX_DAY:", MAX_DAY);
  console.log(
    "Days with videos:",
    dsaData.filter((x) => x.tasks.length > 0).length
  );
  console.log(
    "Days with problems:",
    dsaData.filter((x) => x.problems.length > 0).length
  );
}

main();
