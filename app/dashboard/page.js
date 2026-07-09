"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserDashboard } from "@/components/UserDashboard";
import { ScheduleSelector } from "@/components/ScheduleSelector";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [hasSchedule, setHasSchedule] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/users/me")
        .then((res) => res.json())
        .then((data) => {
          setHasSchedule(!!(data && data.schedule));
        })
        .catch((err) => {
          console.error("Error checking user schedule:", err);
          setHasSchedule(!!session?.user?.schedule);
        });
    }
  }, [status, session]);

  if (status === "loading" || hasSchedule === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#030712",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="confirming-spinner" />
      </div>
    );
  }

  if (!hasSchedule) {
    return (
      <ScheduleSelector
        onSelect={() => {
          setHasSchedule(true);
        }}
      />
    );
  }

  return <UserDashboard />;
}
