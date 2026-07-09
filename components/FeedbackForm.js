"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      if (res.ok) {
        setMessage("");
        setStatus("success");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <textarea
        placeholder="Share your problems, questions, or feedback directly with the admin..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={status === "sending"}
        className="feedback-textarea"
        required
      />
      <div className="feedback-actions">
        {status === "success" && <span className="feedback-status success">✅ Feedback sent successfully!</span>}
        {status === "error" && <span className="feedback-status error">❌ Failed to send. Try again.</span>}
        <button 
          type="submit" 
          className="btn-primary btn-sm"
          disabled={status === "sending" || !message.trim()}
        >
          {status === "sending" ? "Submitting..." : "Send Feedback"}
        </button>
      </div>
    </form>
  );
}
