import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        That day is not in your schedule. Open the dashboard and pick a valid day.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

