import { notFound } from "next/navigation";
import { DayView } from "@/components/DayView";
import { getDayById, MAX_DAY } from "@/data";

export function generateStaticParams() {
  return Array.from({ length: MAX_DAY }, (_, i) => ({ id: String(i + 1) }));
}

export default function DayPage({ params }) {
  const day = getDayById(params.id);
  if (!day) notFound();
  return <DayView day={day} />;
}
