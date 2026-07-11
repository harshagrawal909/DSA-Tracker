"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/dashboard");
      return;
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchUsers();
      fetchConfig();
    }
  }, [status, session, router]);

  const [whatsappLink, setWhatsappLink] = useState("");
  const [basePrice, setBasePrice] = useState("799");
  const [surveyDiscount, setSurveyDiscount] = useState("200");
  const [savingSettings, setSavingSettings] = useState(false);

  // Global campaign settings state
  const [campaignActive, setCampaignActive] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [campaignDiscountType, setCampaignDiscountType] = useState("percent");
  const [campaignDiscountValue, setCampaignDiscountValue] = useState("0");
  const [savingCampaign, setSavingCampaign] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.whatsappLink) setWhatsappLink(data.whatsappLink);
          if (data.basePrice !== undefined) setBasePrice(String(data.basePrice));
          if (data.surveyDiscount !== undefined) setSurveyDiscount(String(data.surveyDiscount));
          if (data.campaignActive !== undefined) setCampaignActive(Boolean(data.campaignActive));
          if (data.campaignTitle !== undefined) setCampaignTitle(data.campaignTitle);
          if (data.campaignMessage !== undefined) setCampaignMessage(data.campaignMessage);
          if (data.campaignDiscountType !== undefined) setCampaignDiscountType(data.campaignDiscountType);
          if (data.campaignDiscountValue !== undefined) setCampaignDiscountValue(String(data.campaignDiscountValue));
        }
      }
    } catch (err) {
      console.error("Error loading config:", err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappLink,
          basePrice: Number(basePrice),
          surveyDiscount: Number(surveyDiscount),
        }),
      });
      if (res.ok) {
        alert("Platform settings updated successfully!");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update platform settings: ${errData.error || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    setSavingCampaign(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignActive,
          campaignTitle,
          campaignMessage,
          campaignDiscountType,
          campaignDiscountValue: Number(campaignDiscountValue),
        }),
      });
      if (res.ok) {
        alert("Global campaign settings updated successfully!");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update campaign settings: ${errData.error || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving campaign settings.");
    } finally {
      setSavingCampaign(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, payload) => {
    setActionLoadingId(userId + JSON.stringify(payload));
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...payload }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...payload } : u))
        );
      } else {
        alert("Failed to update user access.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoadingId(userId + "delete");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Coupon management ──
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: "", discountType: "fixed", discountValue: "", maxUses: "" });
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [newlyCreatedCoupon, setNewlyCreatedCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error("Error loading coupons:", err);
    }
  };

  // Add fetchCoupons to the initial load
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchCoupons();
    }
  }, [status, session]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponLoading(true);
    setCouponError(null);
    setNewlyCreatedCoupon(null);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponForm.code,
          discountType: couponForm.discountType,
          discountValue: Number(couponForm.discountValue),
          maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setNewlyCreatedCoupon(data.coupon);
        setCouponForm({ code: "", discountType: "fixed", discountValue: "", maxUses: "" });
      } else {
        setCouponError(data.error || "Failed to create coupon");
      }
    } catch {
      setCouponError("Error creating coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleToggleCoupon = async (code, currentActive) => {
    try {
      await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, isActive: !currentActive }),
      });
      setCoupons((prev) => prev.map((c) => c._id === code ? { ...c, isActive: !currentActive } : c));
    } catch {
      alert("Error toggling coupon");
    }
  };

  const handleDeleteCoupon = async (code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== code));
      }
    } catch {
      alert("Error deleting coupon");
    }
  };

  const stats = useMemo(() => {
    const nonAdmins = users.filter((u) => u.role !== "admin");
    const total = nonAdmins.length;
    const paid = nonAdmins.filter((u) => u.isPaid).length;
    const rate = total ? ((paid / total) * 100).toFixed(1) : 0;
    const revenue = nonAdmins
      .filter((u) => u.isPaid)
      .reduce((sum, u) => {
        if (u.amountPaid !== undefined) {
          return sum + u.amountPaid; // Adds actual dynamic checkout amount (could be 0 for free coupons)
        }
        // Fallback for legacy paid users who paid 149 before coupons/799 base update
        return sum + 149;
      }, 0);
    return { total, paid, rate, revenue };
  }, [users]);

  if (loading || status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="btn-spinner" style={{ width: "2.5rem", height: "2.5rem" }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#f1f5f9", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#fff" }}>👑 Admin Console</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage user access and track conversions</p>
          </div>
          <Link href="/dashboard" className="btn-primary btn-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Platform Settings Card */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(139, 92, 246, 0.2)", padding: "1.5rem", borderRadius: "1rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span>⚙️ Platform Settings</span>
          </h2>
          <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* WhatsApp Link Input */}
              <div style={{ flex: "2", minWidth: "280px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "0.4rem" }}>
                  💬 WhatsApp Group Link
                </label>
                <input
                  type="url"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="Enter WhatsApp Group Link (e.g. https://chat.whatsapp.com/...)"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    color: "#fff",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              {/* Base Price Input */}
              <div style={{ flex: "1", minWidth: "120px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "0.4rem" }}>
                  💵 Base Price (₹)
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="e.g. 799"
                  required
                  min="0"
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    color: "#fff",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              {/* Survey Discount Input */}
              <div style={{ flex: "1", minWidth: "120px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "0.4rem" }}>
                  🎟️ Survey Coupon Discount (₹)
                </label>
                <input
                  type="number"
                  value={surveyDiscount}
                  onChange={(e) => setSurveyDiscount(e.target.value)}
                  placeholder="e.g. 200"
                  required
                  min="0"
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.6rem 0.8rem",
                    color: "#fff",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={savingSettings}
                style={{
                  background: "linear-gradient(135deg, var(--purple) 0%, #6d28d9 100%)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  padding: "0.65rem 1.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)"
                }}
              >
                {savingSettings ? "Saving Settings..." : "Save Platform Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Global Campaign Manager Card */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(251, 191, 36, 0.2)", padding: "1.5rem", borderRadius: "1rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span>📢 Global Flash Sale Campaign Manager</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Override the base price with a site-wide discount event. When active, it displays a top banner on the home page and slashes the checkout price automatically.
          </p>
          <form onSubmit={handleSaveCampaign} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Active Toggle & Basic Fields */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              
              {/* Campaign Status Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 1rem", minWidth: "160px" }}>
                <input
                  type="checkbox"
                  id="campaignActive"
                  checked={campaignActive}
                  onChange={(e) => setCampaignActive(e.target.checked)}
                  style={{ cursor: "pointer", width: "16px", height: "16px" }}
                />
                <label htmlFor="campaignActive" style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: "600", cursor: "pointer" }}>
                  Campaign Active
                </label>
              </div>

              {/* Discount Type */}
              <div style={{ minWidth: "120px" }}>
                <select
                  value={campaignDiscountType}
                  onChange={(e) => setCampaignDiscountType(e.target.value)}
                  style={{ width: "100%", background: "#0a0f1d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem", height: "100%" }}
                >
                  <option value="percent">Percentage (%) Off</option>
                  <option value="fixed">Fixed Amount (₹) Off</option>
                </select>
              </div>

              {/* Discount Value */}
              <div style={{ flex: "1", minWidth: "120px" }}>
                <input
                  type="number"
                  value={campaignDiscountValue}
                  onChange={(e) => setCampaignDiscountValue(e.target.value)}
                  placeholder="Discount value"
                  required
                  min="0"
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            {/* Campaign Text Fields */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Campaign Title */}
              <div style={{ flex: "1", minWidth: "240px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "0.4rem" }}>
                  Campaign Title / Reason
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Placement Season Special!"
                  required={campaignActive}
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
                />
              </div>

              {/* Campaign Message */}
              <div style={{ flex: "2", minWidth: "300px" }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "0.4rem" }}>
                  Campaign Message / Subtext
                </label>
                <input
                  type="text"
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="e.g. Get 50% off. Limited time offer, grab immediately!"
                  required={campaignActive}
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.8rem", color: "#fff", fontSize: "0.9rem" }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={savingCampaign}
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#fff",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  padding: "0.65rem 1.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)"
                }}
              >
                {savingCampaign ? "Saving Settings..." : "Save Campaign Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Coupon Manager Card */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(139,92,246,0.2)", padding: "1.25rem", borderRadius: "1rem", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span>🎟️ Coupon Manager</span>
            <span style={{ fontSize: "0.7rem", background: "rgba(139,92,246,0.15)", color: "#a78bfa", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>Base: ₹{basePrice}</span>
          </h2>

          {/* Create coupon form */}
          <form onSubmit={handleCreateCoupon} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
              placeholder="CODE"
              required
              maxLength={20}
              style={{ width: "110px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.5rem 0.6rem", color: "#fff", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "0.05em", textTransform: "uppercase" }}
            />
            <select
              value={couponForm.discountType}
              onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.5rem", color: "#fff", fontSize: "0.85rem" }}
            >
              <option value="fixed">₹ Off</option>
              <option value="percent">% Off</option>
            </select>
            <input
              type="number"
              value={couponForm.discountValue}
              onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
              placeholder={couponForm.discountType === "fixed" ? "Amount (₹)" : "Percent (%)"}
              required
              min="1"
              max={couponForm.discountType === "percent" ? "100" : String(basePrice)}
              style={{ width: "110px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.5rem 0.6rem", color: "#fff", fontSize: "0.85rem" }}
            />
            <input
              type="number"
              value={couponForm.maxUses}
              onChange={(e) => setCouponForm({ ...couponForm, maxUses: e.target.value })}
              placeholder="Max uses (∞)"
              min="1"
              style={{ width: "110px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.5rem 0.6rem", color: "#fff", fontSize: "0.85rem" }}
            />
            <button
              type="submit"
              disabled={couponLoading}
              style={{ background: "#8b5cf6", color: "#fff", border: "none", fontWeight: "700", fontSize: "0.85rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}
            >
              {couponLoading ? "..." : "Create"}
            </button>
          </form>
          {couponError && <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{couponError}</p>}

          {/* Newly Created Coupon Share Box */}
          {newlyCreatedCoupon && (
            <div style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              position: "relative"
            }}>
              <button
                onClick={() => setNewlyCreatedCoupon(null)}
                style={{
                  position: "absolute", top: "0.75rem", right: "0.75rem",
                  background: "none", border: "none", color: "#94a3b8", cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                ✕
              </button>
              <h4 style={{ color: "#34d399", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                <span>🎉 Coupon &quot;{newlyCreatedCoupon._id}&quot; Created Successfully!</span>
              </h4>
              <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "0.6rem" }}>
                Here is a professional sharing message you can copy and post to your WhatsApp community or student groups:
              </p>
              
              <div style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "#cbd5e1",
                whiteSpace: "pre-wrap",
                maxHeight: "150px",
                overflowY: "auto",
                marginBottom: "0.6rem"
              }}>
                {(() => {
                  const coupon = newlyCreatedCoupon;
                  const currentBase = Number(basePrice) || 799;
                  const discountText = coupon.discountType === "fixed"
                    ? `₹${coupon.discountValue} FLAT discount`
                    : `${coupon.discountValue}% discount`;
                  const finalPrice = coupon.discountType === "fixed"
                    ? Math.max(0, currentBase - coupon.discountValue)
                    : Math.max(0, Math.round(currentBase * (1 - coupon.discountValue / 100)));
                  const priceText = finalPrice === 0 
                    ? "FREE lifetime access" 
                    : `lifetime access for just *₹${finalPrice}* (originally ₹${currentBase})`;
                  const origin = typeof window !== "undefined" ? window.location.origin : "https://algopath.vercel.app";
                  return `🚀 *AlgoPath Pro Lifetime Access Offer!* 🎯\n\nHey study group! Master Data Structures & Algorithms with interactive trackers, custom schedules, and progress sheets.\n\nUse coupon code *${coupon._id}* to get **${discountText}** and get ${priceText}! ✨\n\n👉 Join now: ${origin}\n\n*Limited to first ${coupon.maxUses || "few"} students. Consistent prep starts here!* 💻`;
                })()}
              </div>

              <button
                onClick={() => {
                  const coupon = newlyCreatedCoupon;
                  const currentBase = Number(basePrice) || 799;
                  const discountText = coupon.discountType === "fixed"
                    ? `₹${coupon.discountValue} FLAT discount`
                    : `${coupon.discountValue}% discount`;
                  const finalPrice = coupon.discountType === "fixed"
                    ? Math.max(0, currentBase - coupon.discountValue)
                    : Math.max(0, Math.round(currentBase * (1 - coupon.discountValue / 100)));
                  const priceText = finalPrice === 0 
                    ? "FREE lifetime access" 
                    : `lifetime access for just *₹${finalPrice}* (originally ₹${currentBase})`;
                  const origin = typeof window !== "undefined" ? window.location.origin : "https://algopath.vercel.app";
                  const shareMsg = `🚀 *AlgoPath Pro Lifetime Access Offer!* 🎯\n\nHey study group! Master Data Structures & Algorithms with interactive trackers, custom schedules, and progress sheets.\n\nUse coupon code *${coupon._id}* to get **${discountText}** and get ${priceText}! ✨\n\n👉 Join now: ${origin}\n\n*Limited to first ${coupon.maxUses || "few"} students. Consistent prep starts here!* 💻`;
                  navigator.clipboard.writeText(shareMsg);
                  alert("Sharing message copied to clipboard!");
                }}
                style={{
                  background: "#10b981", color: "#fff", border: "none", fontWeight: "700",
                  fontSize: "0.75rem", padding: "0.4rem 0.8rem", borderRadius: "0.375rem", cursor: "pointer"
                }}
              >
                📋 Copy Sharing Message
              </button>
            </div>
          )}

          {/* Coupon list */}
          {coupons.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Code</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Discount</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Final Price</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Used</th>
                    <th style={{ padding: "0.75rem 0.5rem" }}>Status</th>
                    <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    const currentBase = Number(basePrice) || 799;
                    const fp = c.discountType === "fixed"
                      ? Math.max(0, currentBase - c.discountValue)
                      : Math.max(0, Math.round(currentBase * (1 - c.discountValue / 100)));
                    return (
                      <tr key={c._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "0.6rem 0.5rem", fontWeight: "700", color: "#fff", letterSpacing: "0.05em" }}>{c._id}</td>
                        <td style={{ padding: "0.6rem 0.5rem", color: "#cbd5e1" }}>
                          {c.discountType === "fixed" ? `₹${c.discountValue} off` : `${c.discountValue}% off`}
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", color: fp === 0 ? "#34d399" : "#a78bfa", fontWeight: "700" }}>
                          {fp === 0 ? "FREE" : `₹${fp}`}
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", color: "#94a3b8" }}>
                          {c.usedCount}{c.maxUses ? `/${c.maxUses}` : "/∞"}
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem" }}>
                          <span style={{
                            fontSize: "0.7rem", fontWeight: "600",
                            background: c.isActive ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
                            color: c.isActive ? "#34d399" : "#f87171",
                            padding: "0.2rem 0.5rem", borderRadius: "9999px"
                          }}>
                            {c.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td style={{ padding: "0.6rem 0.5rem", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                            <button
                              onClick={() => handleToggleCoupon(c._id, c.isActive)}
                              style={{
                                background: c.isActive ? "rgba(251,191,36,0.1)" : "rgba(52,211,153,0.1)",
                                border: "1px solid " + (c.isActive ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)"),
                                color: c.isActive ? "#fbbf24" : "#34d399",
                                fontSize: "0.7rem", fontWeight: "600", padding: "0.25rem 0.5rem",
                                borderRadius: "0.375rem", cursor: "pointer"
                              }}
                            >
                              {c.isActive ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => {
                                const discountText = c.discountType === "fixed"
                                  ? `₹${c.discountValue} FLAT discount`
                                  : `${c.discountValue}% discount`;
                                const finalPrice = c.discountType === "fixed"
                                  ? Math.max(0, 799 - c.discountValue)
                                  : Math.max(0, Math.round(799 * (1 - c.discountValue / 100)));
                                const priceText = finalPrice === 0 
                                  ? "FREE lifetime access" 
                                  : `lifetime access for just *₹${finalPrice}* (originally ₹799)`;
                                const origin = typeof window !== "undefined" ? window.location.origin : "https://algopath.vercel.app";
                                const shareMsg = `🚀 *AlgoPath Pro Lifetime Access Offer!* 🎯\n\nHey study group! Master Data Structures & Algorithms with interactive trackers, custom schedules, and progress sheets.\n\nUse coupon code *${c._id}* to get **${discountText}** and get ${priceText}! ✨\n\n👉 Join now: ${origin}\n\n*Limited to first ${c.maxUses || "few"} students. Consistent prep starts here!* 💻`;
                                navigator.clipboard.writeText(shareMsg);
                                alert(`Sharing message for coupon "${c._id}" copied to clipboard!`);
                              }}
                              style={{
                                background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)",
                                color: "#34d399", fontSize: "0.7rem", fontWeight: "600", padding: "0.25rem 0.5rem",
                                borderRadius: "0.375rem", cursor: "pointer"
                              }}
                            >
                              Copy Msg
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c._id)}
                              style={{
                                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)",
                                color: "#f87171", fontSize: "0.7rem", fontWeight: "600", padding: "0.25rem 0.5rem",
                                borderRadius: "0.375rem", cursor: "pointer"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {coupons.length === 0 && (
            <p style={{ color: "#64748b", fontSize: "0.85rem", textAlign: "center", padding: "1rem 0" }}>
              No coupons created yet. Create your first coupon above!
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#94a3b8" }}>Total Signups</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#fff", marginTop: "0.5rem" }}>{stats.total}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#34d399" }}>Paid Users</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#34d399", marginTop: "0.5rem" }}>{stats.paid}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#8b5cf6" }}>Est. Revenue</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#a78bfa", marginTop: "0.5rem" }}>₹{stats.revenue}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#fb923c" }}>Conversion Rate</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#fb923c", marginTop: "0.5rem" }}>{stats.rate}%</h3>
          </div>
        </div>

        {/* Database Table */}
        <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#fff" }}>User Database</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase" }}>
                  <th style={{ padding: "1rem 1.25rem" }}>User</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Role</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Access</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Schedule</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Joined</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Paid Amount</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isCurrentUser = u._id === session?.user?.id;
                  const isActionLoading = (actionType) => actionLoadingId === u._id + actionType;

                  return (
                    <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.9rem" }}>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img src={u.image || "https://lh3.googleusercontent.com/a/default-user=s96-c"} alt={u.name} style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%" }} />
                          <div>
                            <div style={{ fontWeight: "600", color: "#fff" }}>{u.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "600", background: u.role === "admin" ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.06)", color: u.role === "admin" ? "#c084fc" : "#94a3b8", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "600", background: u.isPaid ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.1)", color: u.isPaid ? "#34d399" : "#94a3b8", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>
                          {u.isPaid ? "Paid" : "Free"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        {u.schedule ? (
                          <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                            {u.schedule.type}
                          </div>
                        ) : (
                          <span style={{ color: "#64748b" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", color: "#64748b", fontSize: "0.8rem" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "N/A"}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        {u.isPaid ? (
                          u.role === "admin" ? (
                            <span style={{ color: "#c084fc", fontWeight: "600", fontSize: "0.8rem" }}>₹0 (Admin)</span>
                          ) : u.amountPaid !== undefined ? (
                            <div>
                              <div style={{ color: "#34d399", fontWeight: "700", fontSize: "0.85rem" }}>₹{u.amountPaid}</div>
                              {u.couponCode && (
                                <div style={{ fontSize: "0.7rem", color: "#a78bfa", marginTop: "0.1rem" }}>
                                  🎟️ {u.couponCode} (-₹{u.discountAmount !== undefined ? u.discountAmount : Math.max(0, 799 - u.amountPaid)})
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: "#cbd5e1", fontSize: "0.8rem" }}>₹149 (Legacy)</span>
                          )
                        ) : (
                          <span style={{ color: "#64748b" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          
                          {/* Give Access Button */}
                          {!u.isPaid && (
                            <button
                              onClick={() => handleUpdateUser(u._id, { isPaid: true })}
                              disabled={actionLoadingId !== null}
                              style={{
                                background: "rgba(52, 211, 153, 0.15)",
                                border: "1px solid rgba(52, 211, 153, 0.2)",
                                color: "#34d399",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer"
                              }}
                            >
                              {isActionLoading('{"isPaid":true}') ? "..." : "Give Access"}
                            </button>
                          )}

                          {/* Make Admin Button */}
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleUpdateUser(u._id, { role: "admin", isPaid: true })}
                              disabled={actionLoadingId !== null}
                              style={{
                                background: "rgba(139, 92, 246, 0.15)",
                                border: "1px solid rgba(139, 92, 246, 0.2)",
                                color: "#a78bfa",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer"
                              }}
                            >
                              {isActionLoading('{"role":"admin","isPaid":true}') ? "..." : "Make Admin"}
                            </button>
                          )}

                          {/* Delete Button */}
                          {!isCurrentUser && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={actionLoadingId !== null}
                              style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.15)",
                                color: "#f87171",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                padding: "0.3rem 0.6rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer"
                              }}
                            >
                              {isActionLoading("delete") ? "..." : "Delete"}
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
