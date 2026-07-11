"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    year: "",
    dsaLevel: "",
    triedStriver: "",
    trackingMethod: "",
    excitedFeature: "",
    feedback: "",
    rating: "",
    fairPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(200);

  // Load configured discount to show in the UI
  useEffect(() => {
    fetch("/api/config")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data && data.surveyDiscount !== undefined) {
          setDiscountAmount(data.surveyDiscount);
        }
      })
      .catch((err) => console.error("Error loading config:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData(data);
      } else {
        setError(data.error || "Failed to submit survey. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (successData?.couponCode) {
      navigator.clipboard.writeText(successData.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successData) {
    return (
      <div className="landing-root" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", padding: "2rem 1.5rem", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "#0f172a",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "1.25rem",
          padding: "2.5rem",
          maxWidth: "32rem",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          animation: "scaleIn 0.3s ease"
        }}>
          <span style={{ fontSize: "3.5rem" }}>🎉</span>
          <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: "900", marginTop: "1rem", marginBottom: "0.5rem" }}>
            Thank You!
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            Your feedback has been saved. We have successfully linked your coupon to your email: <strong>{formData.email.toLowerCase().trim()}</strong>.
          </p>

          <div style={{
            background: "rgba(139, 92, 246, 0.08)",
            border: "1px dashed rgba(139, 92, 246, 0.4)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "2rem"
          }}>
            <p style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
              Your Discount Coupon
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#fff", letterSpacing: "0.05em" }}>
                {successData.couponCode}
              </span>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? "#10b981" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {copied ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem" }}>
              Saves ₹{successData.discountAmount} at checkout! This discount will automatically apply when you log in.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/?showPayment=1"
              className="btn-primary btn-lg"
              style={{ width: "100%", textDecoration: "none", textAlign: "center", justifyContent: "center" }}
            >
              Login &amp; Upgrade to Pro Now →
            </Link>
            <Link
              href="/"
              style={{ color: "#94a3b8", fontSize: "0.85rem", textDecoration: "underline", cursor: "pointer" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-root" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
              <img src="/logo.png" alt="AlgoPath" style={{ height: "32px", width: "auto" }} />
            </Link>
          </div>
          <div>
            <Link href="/" className="btn-primary btn-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none" }}>
              ← Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: "64rem", width: "100%", margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left: Survey Form */}
        <section style={{ background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" }}>
          <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "0.5rem" }}>
            Help Us Improve
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem", lineHeight: "1.5" }}>
            Fill out this 2-minute survey. Upon submission, you will unlock a <strong>₹{discountAmount} discount coupon</strong> automatically mapped to your email.
          </p>

          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* 1. Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                1. Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              />
            </div>

            {/* 2. Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                2. Email Address <span style={{ color: "#f87171" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email (used to auto-apply coupon)"
                required
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                Ensure this matches the Google account you will use to log in.
              </span>
            </div>

            {/* 3. College/Company */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                3. College / Company Name
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. IIT Delhi, KIIT, Google"
                required
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              />
            </div>

            {/* 4. Year of Study */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                4. Year of Study / Professional Status
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select option</option>
                <option value="1st Year">1st Year (B.Tech / BCA / BSc)</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year / Final Year</option>
                <option value="Graduated">Graduated (Unemployed)</option>
                <option value="Working Professional">Working Professional</option>
              </select>
            </div>

            {/* 5. DSA Level */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                5. What is your current DSA experience level?
              </label>
              <select
                name="dsaLevel"
                value={formData.dsaLevel}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select option</option>
                <option value="Beginner">Beginner (Just started, learning basics)</option>
                <option value="Intermediate">Intermediate (Can solve easy/medium on Leetcode)</option>
                <option value="Advanced">Advanced (Comfortable with trees, graphs, DP)</option>
              </select>
            </div>

            {/* 6. Tried Striver Sheet */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                6. Have you tried Striver&apos;s A2Z DSA sheet?
              </label>
              <select
                name="triedStriver"
                value={formData.triedStriver}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select option</option>
                <option value="Yes">Yes, regularly</option>
                <option value="Slightly">Slightly / Tried some parts</option>
                <option value="No">No, I track other sheets</option>
                <option value="Never Heard">Never heard of it</option>
              </select>
            </div>

            {/* 7. Tracking Method */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                7. How do you currently track your DSA questions?
              </label>
              <select
                name="trackingMethod"
                value={formData.trackingMethod}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select option</option>
                <option value="Not tracking">I don&apos;t track anywhere</option>
                <option value="Excel / Spreadsheet">Excel Sheet / Google Sheets</option>
                <option value="Notion / Obsidian">Notion / Obsidian templates</option>
                <option value="Notebook / Paper">Handwritten Notebook</option>
                <option value="LeetCode / GFG lists">LeetCode/GFG bookmarks list</option>
              </select>
            </div>

            {/* 8. Excited Feature */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                8. Which of our upcoming features are you most excited about?
              </label>
              <select
                name="excitedFeature"
                value={formData.excitedFeature}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select option</option>
                <option value="Embedded Compiler">In-Platform Compiler/Editor (Solve without leaving site)</option>
                <option value="Contests">Weekly Coding Contests &amp; Leaderboards</option>
                <option value="Core Subjects">Core CS Subjects notes &amp; MCQs (OOPs, OS, CN, DBMS)</option>
                <option value="Company Filter">Company-specific problem filters</option>
              </select>
            </div>

            {/* 9. Feedback */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                9. Suggestions or features you want to see?
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Tell us what would make this platform perfect for you..."
                rows="3"
                style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem", resize: "none" }}
              />
            </div>

            {/* 10. Rating */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                10. Rate our landing page design &amp; layout
              </label>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} style={{ display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer", color: "#cbd5e1", fontSize: "0.9rem" }}>
                    <input
                      type="radio"
                      name="rating"
                      value={num}
                      checked={Number(formData.rating) === num}
                      onChange={handleChange}
                      required
                    />
                    {num} Star
                  </label>
                ))}
              </div>
            </div>

            {/* 11. Pricing Preferrence */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", marginBottom: "0.4rem" }}>
                11. What would be the most reasonable price for you for a Lifetime Pro Access (including compiler, contests, core subjects, and dashboard)?
              </label>
              <select
                name="fairPrice"
                value={formData.fairPrice}
                onChange={handleChange}
                required
                style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
              >
                <option value="">Select pricing</option>
                <option value="₹199">₹199 (Extremely budget-friendly)</option>
                <option value="₹299">₹299</option>
                <option value="₹499">₹499</option>
                <option value="₹799">₹799 (Current pricing - fair value)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
            >
              {loading ? <span className="btn-spinner" /> : "Submit Feedback & Get Coupon"}
            </button>
          </form>
        </section>

        {/* Right: Upcoming Features Showcase */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "sticky", top: "120px" }}>
          <div style={{ background: "rgba(139, 92, 246, 0.05)", border: "1px solid rgba(139, 92, 246, 0.15)", borderRadius: "1.25rem", padding: "1.5rem" }}>
            <h2 className="gradient-text" style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1rem" }}>
              🚀 Upcoming Features (Coming Soon!)
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: "700", marginBottom: "0.25rem" }}>
                  💻 In-Platform Coding IDE
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  Solve coding questions directly on our site. Features Monaco Editor (VS Code engine) and Judge0 compilers with support for C++, Java, Python, and JavaScript.
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: "700", marginBottom: "0.25rem" }}>
                  🏆 Weekly Coding Contests
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  Participate in structured weekly contests on announced topics. Solve custom problems under a timer and rank on the global student leaderboard!
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: "700", marginBottom: "0.25rem" }}>
                  📚 Core CS Subject Prep
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  Tackle placements fully with dedicated theory prep resources and interactive multiple-choice quizzes (MCQs) for DBMS, OS, Computer Networks, and OOPs.
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "0.95rem", color: "#fff", fontWeight: "700", marginBottom: "0.25rem" }}>
                  🏢 Company-Wise Filters
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }}>
                  Directly filter your Striver sheet questions by company tags (e.g. Amazon, Google, Microsoft, TCS) to practice company-specific patterns.
                </p>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}
