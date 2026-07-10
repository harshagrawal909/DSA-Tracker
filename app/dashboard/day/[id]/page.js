import { DayView } from "@/components/DayView";

export function generateStaticParams() {
  // Support maximum of 141 calendar days (from 6 Months - Relaxed plan)
  return Array.from({ length: 141 }, (_, i) => ({ id: String(i + 1) }));
}

export default function DashboardDayPage({ params }) {
  return (
    <div className="dayview-container">
      <DayView dayNum={Number(params.id)} basePath="/dashboard/day" />
    </div>
  );
}
