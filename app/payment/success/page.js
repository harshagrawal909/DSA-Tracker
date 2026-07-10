"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const WHATSAPP_LINK = "https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_LINK";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { update } = useSession();
  const [countdown, setCountdown] = useState(5);
  const [confetti, setConfetti] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/REPLACE_WITH_YOUR_GROUP_LINK");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data && data.whatsappLink) {
          setWhatsappLink(data.whatsappLink);
        }
      })
      .catch((err) => console.error("Error loading whatsapp link:", err));
  }, []);

  useEffect(() => {
    const particles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][
        Math.floor(Math.random() * 5)
      ],
      size: 6 + Math.random() * 8,
      speed: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
    }));
    setConfetti(particles);

    // Force session refresh so isPaid is true before going to dashboard
    update();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, update]);


  return (
    <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", color: "#fff", padding: "1.5rem" }}>
      <div className="confetti-container" aria-hidden="true">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="confetti-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
              animationDuration: `${p.speed}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div style={{ background: "#0f172a", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "1.75rem", padding: "2.5rem 2rem", width: "100%", maxWidth: "26rem", textAlign: "center", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "900", marginBottom: "0.5rem" }}>Payment Successful!</h1>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.75rem" }}>
          Thank you for upgrading! You now have lifetime access to AlgoPath. Your default 3-month schedule is ready.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", padding: "0.875rem 2rem", borderRadius: "9999px", fontSize: "1rem", fontWeight: "700", background: "#25d366", color: "#fff", textDecoration: "none" }}
          >
            💬 Join WhatsApp Study Group
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Go to Dashboard Now
          </button>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}
