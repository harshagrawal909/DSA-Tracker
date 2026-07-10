"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PRICE = "₹149";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function PaymentModal({ onClose, userName }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      if (data.isMock) {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isMock: true, razorpay_payment_id: "mock_pay_" + Date.now() })
        });
        if (verifyRes.ok) {
          router.push(`/payment/success?session_id=mock_${Date.now()}`);
        } else {
          setError("Mock payment verification failed.");
          setLoading(false);
        }
        return;
      }

      const isLoaded = window.Razorpay;
      if (!isLoaded) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setError("Failed to load Razorpay payment gateway. Please check your internet connection.");
          setLoading(false);
          return;
        }
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "AlgoPath",
        description: "Lifetime Access",
        order_id: data.order_id,
        prefill: {
          name: data.user?.name || userName || "",
          email: data.user?.email || "",
        },
        handler: async function (response) {
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                isMock: false
              })
            });
            if (verifyRes.ok) {
              router.push(`/payment/success?session_id=${response.razorpay_payment_id}`);
            } else {
              const verifyData = await verifyRes.json();
              setError(verifyData.error || "Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            console.error(err);
            setError("Signature verification failed due to network error.");
            setLoading(false);
          }
        },
        theme: {
          color: "#8b5cf6"
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="payment-modal-compact"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f172a",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: "1.25rem",
          padding: "1.75rem",
          width: "100%",
          maxWidth: "22rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          position: "relative",
          animation: "slideUp 0.3s ease",
          color: "#fff"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "1.1rem",
            cursor: "pointer",
            padding: "0.2rem"
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "2.5rem" }}>⚡</span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", marginTop: "0.5rem", marginBottom: "0.25rem" }}>
            Upgrade to Pro
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
            Get lifetime access to the curriculum, streak trackers, and community.
          </p>

          <div
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1.5rem"
            }}
          >
            <span style={{ fontSize: "1.75rem", fontWeight: "900", display: "block" }}>{PRICE}</span>
            <span style={{ fontSize: "0.7rem", color: "#a78bfa", fontWeight: "600" }}>
              One-time Payment • Lifetime Access
            </span>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <button
            className="btn-primary btn-lg"
            onClick={handleCheckout}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
            id="checkout-btn"
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <span>Pay Now with Cards/UPI</span>
            )}
          </button>

          <p style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "1rem" }}>
            Secure checkout via Razorpay. Automatic redirect after payment.
          </p>
        </div>
      </div>
    </div>
  );
}
