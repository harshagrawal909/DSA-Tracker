"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserDashboard } from "@/components/UserDashboard";
import { ScheduleSelector } from "@/components/ScheduleSelector";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [hasSchedule, setHasSchedule] = useState(null);

  const adminEmails = ["harshagrawal4256@gmail.com", "aadilmittal62@gmail.com"];

  useEffect(() => {
    // Auth check: redirect to home if not logged in or not paid/admin
    if (status === "unauthenticated") {
      window.location.href = "/";
      return;
    }

    if (status === "authenticated") {
      const isAdminByEmail = session?.user?.email
        ? adminEmails.includes(session.user.email.toLowerCase())
        : false;
      const isAdmin = session?.user?.role === "admin" || isAdminByEmail;
      const isPaid = session?.user?.isPaid;

      if (!isAdmin && !isPaid) {
        // Logged in but not paid
        window.location.href = "/?showPayment=1";
        return;
      }

      // Fetch schedule
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

  if (status === "loading" || (status === "authenticated" && hasSchedule === null)) {
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
