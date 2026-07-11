"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { hasUserPaid } from "@/lib/payment";
import { SCHEDULE_OPTIONS } from "@/lib/schedule";

/* ── Animated counter ─────────────────────────────────────── */
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ── Feature data ─────────────────────────────────────────── */
const FEATURES = [
  { icon: "📅", title: "Your Pace, Your Schedule", desc: "Choose from 1-month intensive to 6-month relaxed. The tracker adapts to your timeline automatically." },
  { icon: "🔥", title: "Streak Tracker", desc: "Build momentum with daily streaks. Visual heatmaps show your consistency at a glance." },
  { icon: "📹", title: "Video + Problem Tracking", desc: "Track both video lectures and coding problems. Mark done, filter pending — all in one place." },
  { icon: "📝", title: "Personal Notes", desc: "Write approach notes per problem. Your insights saved locally and always accessible." },
  { icon: "📊", title: "Progress Dashboard", desc: "Real-time stats — problems solved, videos watched, overall completion percentage." },
  { icon: "💬", title: "Community Access", desc: "Join our exclusive WhatsApp group. Ask doubts, share progress, stay motivated together." },
];

const FAQS = [
  { q: "Is this a subscription or one-time payment?", a: "100% one-time payment. Pay once, access forever. No hidden charges, no renewals." },
  { q: "Can I choose my study speed?", a: "Yes! After joining you choose from 4 pace options: 1 month (intensive), 2 months (fast), 3 months (balanced), or 6 months (relaxed). You can switch anytime from your dashboard." },
  { q: "What do I get after paying?", a: "Instant access to the full AlgoPath dashboard + access to our WhatsApp study group where you can discuss problems and get help." },
  { q: "How do I pay?", a: "Scan the UPI QR code shown after login. Pay via any UPI app (GPay, PhonePe, Paytm, etc.) and click 'I've Paid'. Access is granted immediately." },
  { q: "What if I lose my progress?", a: "Your progress is saved per device. We recommend using the same browser consistently." },
  { q: "Is this based on any specific DSA course?", a: "Yes! The tracker follows Striver's A2Z DSA Sheet — one of the most popular and comprehensive DSA roadmaps for cracking coding interviews." },
];

/* ── Main Component ───────────────────────────────────────── */
export function LandingPage({ onPaymentRequired }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewerMode = searchParams ? searchParams.get("reviewer") === "true" : false;

  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [modalOnlyTerms, setModalOnlyTerms] = useState(false);
  const [modalOnlyPrivacy, setModalOnlyPrivacy] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((res) => { if (res.ok) return res.json(); })
      .then((data) => { if (data && data.whatsappLink) setWhatsappLink(data.whatsappLink); })
      .catch((err) => console.error("Error loading whatsapp link:", err));
  }, []);

  const [c1, r1] = useCounter(450);
  const [c2, r2] = useCounter(61);
  const [c3, r3] = useCounter(1200);

  useEffect(() => {
    // If user is already authenticated and has access, redirect to dashboard
    if (status === "authenticated" && session?.user) {
      const adminEmails = ["harshagrawal4256@gmail.com", "aadilmittal62@gmail.com"];
      const isAdminByEmail = session.user.email
        ? adminEmails.includes(session.user.email.toLowerCase())
        : false;
      const isAdmin = session.user.role === "admin" || isAdminByEmail;
      const isPaid = session.user.isPaid;
      if (isAdmin || isPaid) {
        router.push("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleGetAccess = async () => {
    if (status === "authenticated") {
      const adminEmails = ["harshagrawal4256@gmail.com", "aadilmittal62@gmail.com"];
      const isAdminByEmail = session?.user?.email
        ? adminEmails.includes(session.user.email.toLowerCase())
        : false;
      const isAdmin = session?.user?.role === "admin" || isAdminByEmail;
      const isPaid = session?.user?.isPaid;
      if (isAdmin || isPaid) {
        window.location.href = "/dashboard";
        return;
      }
      onPaymentRequired();
      return;
    }
    setModalOnlyTerms(false);
    setModalOnlyPrivacy(false);
    setShowConsentModal(true);
  };

  const handleConsentAccepted = async () => {
    setShowConsentModal(false);
    setLoading(true);
    // Redirect to / first so session fully hydrates before middleware runs on /dashboard
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="landing-root">
      {/* ── Navbar ─────────────────────────── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <img src="/logo.png" alt="AlgoPath" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
          </div>
          <div className="nav-actions">
            {status === "authenticated" ? (
              <div className="nav-user" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={32}
                    height={32}
                    className="nav-avatar"
                  />
                )}
                <button className="btn-primary btn-sm" onClick={onPaymentRequired}>
                  Get Access →
                </button>
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    transition: "all 0.2s"
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                className="btn-primary btn-sm"
                onClick={handleGetAccess}
                disabled={loading}
              >
                {loading ? "Redirecting…" : "Get Access →"}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-bg-grid" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Striver&apos;s A2Z DSA Sheet — Structured &amp; Trackable
          </div>
          <h1 className="hero-title">
            Master DSA{" "}
            <span className="gradient-text">at Your Own Pace</span>
          </h1>
          <p className="hero-subtitle">
            1 month or 6 months — you choose. The only DSA tracker with flexible
            schedules, streak tracking, problem notes, and a community to keep you
            accountable.
          </p>

          {/* Schedule pills */}
          <div className="hero-schedule-pills">
            {SCHEDULE_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="hero-pill"
                style={{ borderColor: opt.color + "55", color: opt.color }}
              >
                {opt.emoji} {opt.weeks}
              </div>
            ))}
          </div>

          <div className="hero-cta-row">
            <button
              className="btn-primary btn-lg"
              onClick={handleGetAccess}
              disabled={loading || status === "loading"}
              id="hero-cta-btn"
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : (
                <span>🚀 Get Lifetime Access – ₹799</span>
              )}
            </button>
            <p className="hero-cta-sub" style={{ marginBottom: "0.75rem" }}>
              One-time payment • No subscription • Instant access
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "0.4rem 1rem", borderRadius: "9999px", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #030712" }} />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #030712", marginLeft: "-8px" }} />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #030712", marginLeft: "-8px" }} />
              </div>
              <span style={{ fontSize: "0.8rem", color: "#e2e8f0", fontWeight: "600" }}>
                ⭐ Joined by <span style={{ color: "#a78bfa" }}>1,000+ students</span> preparing for top tech roles!
              </span>
            </div>

            {whatsappLink && (
              <div style={{ marginTop: "1.25rem" }}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(37, 211, 102, 0.12)",
                    border: "1px solid rgba(37, 211, 102, 0.25)",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "0.75rem",
                    color: "#25d366",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(37, 211, 102, 0.2)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "rgba(37, 211, 102, 0.12)"}
                >
                  <svg
                    style={{ width: "1.1rem", height: "1.1rem", fill: "currentColor" }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.488 4.908 1.489 5.426 0 9.842-4.412 9.845-9.84.001-2.63-1.019-5.1-2.871-6.956-1.854-1.854-4.321-2.875-6.953-2.876-5.432 0-9.849 4.412-9.853 9.843-.001 1.748.461 3.454 1.337 4.975l-.982 3.585 3.668-.962zm11.371-6.725c-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  Join Public WhatsApp Community
                </a>
              </div>
            )}
          </div>

          {/* Code window */}
          <div className="hero-window">
            <div className="window-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="window-title">dsa-tracker.js</span>
            </div>
            <div className="window-body">
              <div className="code-line">
                <span className="code-kw">const</span>{" "}
                <span className="code-var">streak</span>{" "}
                <span className="code-op">=</span>{" "}
                <span className="code-num">42</span>{" "}
                <span className="code-cm">{"// days 🔥"}</span>
              </div>
              <div className="code-line">
                <span className="code-kw">const</span>{" "}
                <span className="code-var">solved</span>{" "}
                <span className="code-op">=</span>{" "}
                <span className="code-num">238</span>{" "}
                <span className="code-cm">{"// problems ✅"}</span>
              </div>
              <div className="code-line">
                <span className="code-kw">const</span>{" "}
                <span className="code-var">schedule</span>{" "}
                <span className="code-op">=</span>{" "}
                <span className="code-str">&quot;3month&quot;</span>{" "}
                <span className="code-cm">{"// balanced 🎯"}</span>
              </div>
              <div className="code-line mt-2">
                <span className="code-fn">tracker</span>
                <span className="code-op">.</span>
                <span className="code-fn">markDone</span>
                <span>(</span>
                <span className="code-str">&quot;Two Sum&quot;</span>
                <span>);</span>{" "}
                <span className="code-cm">{"// 🎯"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────── */}
      <section className="stats-section">
        <div className="section-inner">
          <div className="stats-grid">
            <div className="stat-card" ref={r1}>
              <div className="stat-number gradient-text">{c1}+</div>
              <div className="stat-label">DSA Problems</div>
            </div>
            <div className="stat-card" ref={r2}>
              <div className="stat-number gradient-text">{c2}</div>
              <div className="stat-label">Curriculum Days</div>
            </div>
            <div className="stat-card" ref={r3}>
              <div className="stat-number gradient-text">{c3}+</div>
              <div className="stat-label">Minutes of Content</div>
            </div>
            <div className="stat-card">
              <div className="stat-number gradient-text">1,000+</div>
              <div className="stat-label">Students Joined</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Schedule Options ────────────────── */}
      <section className="schedule-showcase-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Flexible Schedules</span>
            <h2 className="section-title">
              Pick your <span className="gradient-text">study pace</span>
            </h2>
            <p className="section-sub">
              Whether you&apos;re doing full-time prep or studying alongside a job —
              there&apos;s a schedule for you.
            </p>
          </div>
          <div className="showcase-grid">
            {SCHEDULE_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="showcase-card"
                style={{ "--opt-color": opt.color }}
              >
                <div className="showcase-emoji">{opt.emoji}</div>
                <div
                  className="showcase-badge"
                  style={{ background: opt.color + "22", color: opt.color }}
                >
                  {opt.badge}
                </div>
                <h3 className="showcase-label">{opt.label}</h3>
                <p className="showcase-desc">{opt.description}</p>
                <div className="showcase-weeks" style={{ color: opt.color }}>
                  {opt.weeks}
                </div>
              </div>
            ))}
          </div>
          <p className="showcase-switch-note">
            ✨ You can switch between schedules anytime from your dashboard
          </p>
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything to{" "}
              <span className="gradient-text">crack interviews</span>
            </h2>
            <p className="section-sub">
              Built for serious learners who want structure, accountability, and
              measurable progress.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">
              Simple,{" "}
              <span className="gradient-text">honest pricing</span>
            </h2>
            <p className="section-sub">One-time investment. Lifetime value. Use coupons for extra savings!</p>
          </div>
          <div className="pricing-card-wrap">
            <div className="pricing-card">
              <div className="pricing-badge">🏆 Most Popular</div>
              <div className="pricing-name">Lifetime Access</div>
              <div className="pricing-amount">
                <span className="pricing-currency">₹</span>
                <span className="pricing-price">799</span>
              </div>
              <div className="pricing-original">₹1,999 value</div>
              <ul className="pricing-features">
                <li>✅ All 4 schedule options (1/2/3/6 months)</li>
                <li>✅ Switch pace anytime, no re-payment</li>
                <li>✅ 450+ problems with full tracking</li>
                <li>✅ Streak &amp; progress analytics</li>
                <li>✅ Personal notes per problem</li>
                <li>✅ WhatsApp study group access</li>
                <li>✅ Lifetime access, pay once</li>
              </ul>
              <button
                className="btn-primary btn-lg pricing-btn"
                onClick={handleGetAccess}
                disabled={loading || status === "loading"}
                id="pricing-cta-btn"
              >
                {loading ? <span className="btn-spinner" /> : "Get Access Now →"}
              </button>
              <p className="pricing-note">
                UPI payment • Instant access after payment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────── */}
      <section className="faq-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">
              Got <span className="gradient-text">questions?</span>
            </h2>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span>{faq.q}</span>
                  <span className="faq-chevron">{openFaq === i ? "▲" : "▼"}</span>
                </div>
                {openFaq === i && <div className="faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/icon.png" alt="AlgoPath" style={{ height: "28px", width: "28px", borderRadius: "6px", marginRight: "8px", verticalAlign: "middle" }} />
            <span style={{ verticalAlign: "middle", fontWeight: 700 }}>AlgoPath</span>
          </div>

          <div className="footer-links" style={{ display: "flex", gap: "1rem", margin: "1rem 0", fontSize: "0.85rem", justifyContent: "center" }}>
            <button 
              onClick={() => {
                setModalOnlyPrivacy(false);
                setModalOnlyTerms(true);
                setShowConsentModal(true);
              }} 
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}
            >
              Terms of Service
            </button>
            <span style={{ color: "var(--text-muted)" }}>•</span>
            <button 
              onClick={() => {
                setModalOnlyTerms(false);
                setModalOnlyPrivacy(true);
                setShowConsentModal(true);
              }} 
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}
            >
              Privacy Policy
            </button>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} AlgoPath. Built with ❤️ for DSA enthusiasts.
          </p>
        </div>
      </footer>

      {showConsentModal && (
        <TermsConsentModal
          onClose={() => {
            setShowConsentModal(false);
            setModalOnlyTerms(false);
            setModalOnlyPrivacy(false);
          }}
          onAgree={handleConsentAccepted}
          onlyTerms={modalOnlyTerms}
          onlyPrivacy={modalOnlyPrivacy}
          isReviewerMode={isReviewerMode}
        />
      )}
    </div>
  );
}

/* ── Terms Consent Modal ─────────────────────────────────── */
function TermsConsentModal({ onClose, onAgree, onlyTerms, onlyPrivacy, isReviewerMode }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [demoUser, setDemoUser] = useState("");
  const [demoPass, setDemoPass] = useState("");
  const [demoError, setDemoError] = useState(null);

  const handleScroll = (e) => {
    if (onlyTerms || onlyPrivacy) return;
    const target = e.target;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      setHasScrolled(true);
    }
  };

  const title = onlyTerms 
    ? "Terms of Service" 
    : onlyPrivacy 
      ? "Privacy Policy" 
      : "Terms & Privacy Agreement";

  return (
    <div className="consent-modal-overlay" onClick={onClose}>
      <div className="consent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="consent-modal-header">
          <h2 className="consent-modal-title">{title}</h2>
          <button className="consent-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="consent-scroll-box" onScroll={handleScroll}>
          {(!onlyPrivacy) && (
            <>
              <h3>1. Terms of Service</h3>
              <p>Welcome to AlgoPath. By creating an account and subscribing, you agree to comply with and be bound by the following terms and conditions:</p>
              <ul>
                <li><strong>Access License:</strong> We grant you a personal, non-exclusive, non-transferable, and limited license to access our curated tracker, problem links, and community features.</li>
                <li><strong>Lifetime Access:</strong> Lifetime access refers to one-time payment for the lifetime of this specific application. No subscription renewals or monthly bills are charged.</li>
                <li><strong>Prohibited Use:</strong> Sharing account logins, credentials, or scraping/downloading content to redistribute commercially is strictly prohibited. Violation will result in immediate termination without refund.</li>
                <li><strong>Refunds:</strong> Payments are processed via Razorpay. We offer a 90-day satisfaction commitment. Refund requests are subject to review.</li>
              </ul>
            </>
          )}

          {(!onlyTerms) && (
            <>
              <h3>2. Privacy Policy</h3>
              <p>We respect your privacy and are committed to protecting it. Our policy outlines how we handle your personal data:</p>
              <ul>
                <li><strong>Google Sign-In:</strong> We use Google OAuth to securely authenticate your account. We retrieve only your profile name, email address, and avatar image. We never access your Google Drive or other account documents.</li>
                <li><strong>Data Retention:</strong> We store your problem completion status, notes, and pace settings in our secure Firestore database. This data is only used to sync your dashboard.</li>
                <li><strong>Data Protection:</strong> All connection requests are encrypted. Your billing transactions are managed directly by Razorpay secure servers. We do not store or transmit credit card details.</li>
                <li><strong>Rights:</strong> You can request deletion of all your stored data at any time by contacting our support team at harshagrawal4256@gmail.com.</li>
              </ul>
            </>
          )}
        </div>

        {!(onlyTerms || onlyPrivacy) && (
          <>
            <div className="consent-checkbox-row">
              <input 
                type="checkbox" 
                id="consent-check" 
                disabled={!hasScrolled}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label 
                htmlFor="consent-check" 
                className={`consent-checkbox-label ${hasScrolled ? "active" : ""}`}
              >
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {!hasScrolled && (
              <div className="scroll-instruction">
                ⚠️ Please scroll to the bottom of the terms to enable agreement.
              </div>
            )}

            <button 
              className="btn-google-signin"
              disabled={!agreed}
              onClick={onAgree}
            >
              <svg className="google-icon-svg" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign in with Google &amp; Pay
            </button>

            {/* Razorpay Compliance Review Login Form */}
            {isReviewerMode && (
              <div className="reviewer-login-box">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!agreed) {
                      setDemoError("Please scroll down and agree to the Terms & Privacy checkbox first.");
                      return;
                    }
                    setDemoError(null);
                    const res = await signIn("credentials", {
                      username: demoUser,
                      password: demoPass,
                      redirect: false
                    });
                    if (res?.error) {
                      setDemoError("Invalid reviewer credentials.");
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="reviewer-form-layout"
                >
                  <p className="reviewer-desc-text">Enter test account credentials requested by Razorpay Verification Form:</p>
                  <input 
                    type="text" 
                    placeholder="Test Email / Username"
                    value={demoUser}
                    onChange={(e) => setDemoUser(e.target.value)}
                    className="reviewer-input"
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Test Password"
                    value={demoPass}
                    onChange={(e) => setDemoPass(e.target.value)}
                    className="reviewer-input"
                    required
                  />
                  {demoError && <p className="reviewer-error-text">{demoError}</p>}
                  <button 
                    type="submit" 
                    className="btn-reviewer-login"
                  >
                    Log In as Reviewer
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
