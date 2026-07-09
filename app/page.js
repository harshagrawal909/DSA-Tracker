"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { PaymentModal } from "@/components/PaymentModal";

function HomeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.isPaid) {
        router.replace("/dashboard");
      } else if (searchParams.get("showPayment") === "1") {
        setShowPayment(true);
      }
    }
  }, [status, session, searchParams, router]);

  return (
    <>
      <LandingPage onPaymentRequired={() => setShowPayment(true)} />
      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          userName={session?.user?.name}
        />
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#030712" }} />}>
      <HomeContent />
    </Suspense>
  );
}
