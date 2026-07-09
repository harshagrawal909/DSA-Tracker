"use client";

import { useEffect, useState } from "react";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeedbacks(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="feedback-loading">Loading user feedbacks...</div>;
  if (!feedbacks.length) return <div className="feedback-empty-msg">No feedback received from users yet.</div>;

  return (
    <div className="feedback-list-wrap">
      {feedbacks.map((f) => (
        <div key={f._id} className="feedback-item-card">
          <div className="feedback-item-header">
            <div>
              <p className="feedback-user-name">{f.userName}</p>
              <p className="feedback-user-email">{f.userEmail}</p>
            </div>
            <span className="feedback-time">
              {new Date(f.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="feedback-msg-text">{f.message}</p>
        </div>
      ))}
    </div>
  );
}
