"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        className="group inline-flex items-baseline gap-2 transition-opacity hover:opacity-90"
      >
        <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          AlgoPath
        </span>
        <span className="text-sm font-medium text-sky-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400">
          Home
        </span>
      </Link>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme"}
      </button>
    </header>
  );
}
