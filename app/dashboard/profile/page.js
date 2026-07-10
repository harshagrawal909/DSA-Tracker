import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PrintButton from "@/components/PrintButton";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackList from "@/components/FeedbackList";
import AdminUserTable from "@/components/AdminUserTable";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/");
  }

  const userId = session.user.id;
  let userDetails = null;

  try {
    const usersCol = await getUsersCollection();
    userDetails = await usersCol.findOne({ _id: userId });
  } catch (error) {
    console.error("Error loading user details in profile:", error);
  }

  if (!userDetails) {
    userDetails = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: "user",
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
  }

  let allUsers = [];
  if (userDetails.role === "admin") {
    try {
      const usersCol = await getUsersCollection();
      const rawUsers = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
      allUsers = rawUsers.map(u => ({
        ...u,
        _id: u._id.toString()
      }));
    } catch (error) {
      console.error("Error loading all users for admin profile:", error);
    }
  }

  const joinedDate = userDetails.createdAt 
    ? new Date(userDetails.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Recently Joined";

  const paymentDate = userDetails.paidAt
    ? new Date(userDetails.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <main className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* Navigation / Header */}
        <header className="profile-header no-print">
          <div className="header-left">
            <Link href="/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>
            <h1 className="profile-main-title">Profile & Subscription</h1>
          </div>
          {userDetails.role === "admin" && (
            <Link href="/admin" className="btn-secondary btn-sm">
              🛡️ Admin Console
            </Link>
          )}
        </header>

        {/* Content Layout */}
        <div className="profile-grid">
          
          {/* Left Column: Details & Policies */}
          <div className="profile-left-col no-print">
            
            {/* User details card */}
            <div className="profile-card">
              <h2 className="profile-card-title">User Account</h2>
              <div className="profile-avatar-row">
                <Image
                  src={userDetails.image || session.user.image}
                  alt={userDetails.name}
                  width={64}
                  height={64}
                  className="profile-large-avatar"
                />
                <div>
                  <h3 className="profile-details-name">
                    {userDetails.name}
                    {userDetails.role === "admin" && (
                      <span className="admin-pill">Admin</span>
                    )}
                  </h3>
                  <p className="profile-details-email">{userDetails.email}</p>
                  <p className="profile-joined-text">Member since {joinedDate}</p>
                </div>
              </div>
              
              <div className="profile-details-list">
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value ${userDetails.isPaid || userDetails.role === "admin" ? "paid" : "free"}`}>
                    {userDetails.role === "admin" ? "Pro Lifetime Access (Admin)" : userDetails.isPaid ? "Pro Lifetime Access" : "Free Account"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value mono">{userDetails.id || userId}</span>
                </div>
              </div>
            </div>

            {/* Legal Accordion Card */}
            <div className="profile-card">
              <h2 className="profile-card-title">Legal & Policies</h2>
              <details className="legal-details">
                <summary className="legal-summary">Privacy Policy</summary>
                <div className="legal-content">
                  <p><strong>Effective Date: July 9, 2026</strong></p>
                  <p>Your privacy is important to us. We only collect details essential for account authentication and tracking your curriculum progress (such as Google profile name, email, avatar, and problem completion records).</p>
                  <p>Your personal data is never shared with third parties. Authentication is managed securely through Google OAuth, and billing transactions are processed directly by Razorpay in an encrypted sandbox environment.</p>
                </div>
              </details>
              
              <details className="legal-details">
                <summary className="legal-summary">Terms of Service</summary>
                <div className="legal-content">
                  <p><strong>Last Updated: July 9, 2026</strong></p>
                  <p>By registering and making a purchase, you agree to access the curriculum materials for personal, non-commercial use only. Sharing account access with third parties is prohibited.</p>
                  <p>Payments made for Lifetime Pro access are subject to our 90-day satisfaction commitment. If you encounter any technical difficulties, reach out via the official Telegram/WhatsApp groups.</p>
                </div>
              </details>
            </div>

            {/* Feedback / Support Card */}
            <div className="profile-card">
              <h2 className="profile-card-title">💬 Support &amp; Feedback</h2>
              <p className="desc-sub" style={{ marginBottom: "1rem", lineHeight: "1.4" }}>
                Need manual account upgrades, billing fixes, or custom help? Contact us at: 
                <a href="mailto:harshagrawal4256@gmail.com" style={{ color: "var(--purple)", textDecoration: "underline", marginLeft: "0.25rem", fontWeight: "600" }}>
                  harshagrawal4256@gmail.com
                </a>
              </p>
              <FeedbackForm />
            </div>

          </div>

          {/* Right Column: Invoice/Receipt */}
          <div className="profile-right-col">
            
            {userDetails.isPaid || userDetails.role === "admin" ? (
              <div className="invoice-container">
                <div className="invoice-header">
                  <div className="invoice-logo">
                    <img src="/logo.png" alt="AlgoPath" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
                  </div>
                  <div className="invoice-status-paid">PAID IN FULL</div>
                </div>

                <div className="invoice-divider" />

                <div className="invoice-meta-row">
                  <div>
                    <p className="meta-label">Billed To</p>
                    <p className="meta-value bold">{userDetails.name}</p>
                    <p className="meta-value">{userDetails.email}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="meta-label">Invoice Details</p>
                    <p className="meta-value"><span className="meta-label-inline">Date:</span> {paymentDate || joinedDate}</p>
                    <p className="meta-value"><span className="meta-label-inline">Receipt:</span> INV-2026-{(userDetails.id || userId).slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                <div className="invoice-divider" />

                {/* Invoice Table */}
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Description</th>
                      <th style={{ textAlign: "right" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Price</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <span className="bold">AlgoPath Lifetime Access</span>
                        <p className="desc-sub">Complete 60-day interactive path with paced scheduling and community mentorship group access.</p>
                      </td>
                      <td style={{ textAlign: "right" }}>1</td>
                      <td style={{ textAlign: "right" }}>{userDetails.role === "admin" ? "₹0.00" : "₹149.00"}</td>
                      <td style={{ textAlign: "right" }}>{userDetails.role === "admin" ? "₹0.00" : "₹149.00"}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="invoice-divider" />

                {/* Invoice Totals */}
                <div className="invoice-totals">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <span>{userDetails.role === "admin" ? "₹0.00" : "₹149.00"}</span>
                  </div>
                  <div className="totals-row">
                    <span>Tax (0%)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="invoice-divider compact" />
                  <div className="totals-row total-paid">
                    <span>Amount Paid (INR)</span>
                    <span>{userDetails.role === "admin" ? "₹0.00" : "₹149.00"}</span>
                  </div>
                </div>

                <div className="invoice-divider" />

                {/* Transaction metadata */}
                <div className="invoice-transaction-details">
                  <p className="bold" style={{ marginBottom: "0.25rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Transaction Record</p>
                  <p><span>Payment Method:</span> {userDetails.role === "admin" ? "Admin Bypass" : "Razorpay Secure Gateway"}</p>
                  <p><span>Payment ID:</span> <span className="mono">{userDetails.paymentId || (userDetails.role === "admin" ? "admin_bypass_token" : "rzp_test_mock")}</span></p>
                  <p><span>Order ID:</span> <span className="mono">{userDetails.orderId || (userDetails.role === "admin" ? "admin_bypass_order" : "order_mock")}</span></p>
                </div>

                <div className="invoice-divider" />

                <div className="invoice-footer">
                  <p>Thank you for purchasing AlgoPath! Let&apos;s excel in coding interviews together.</p>
                  <p style={{ marginTop: "0.5rem" }} className="no-print">
                    <PrintButton />
                  </p>
                </div>
              </div>
            ) : (
              <div className="profile-card invoice-empty">
                <p className="empty-text">No payment records found.</p>
                <p className="empty-sub">Upgrade your account to unlock Lifetime Pro and view your invoice receipt here.</p>
                <Link href="/dashboard" className="btn-primary btn-sm" style={{ marginTop: "1rem" }}>
                  Upgrade to Pro
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* ── Admin Portal Sections (Full Width) ───────────────────── */}
        {userDetails.role === "admin" && (
          <div className="admin-profile-sections no-print" style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* User details list */}
            <div className="profile-card">
              <h2 className="profile-card-title">🛡️ Admin Console: Registered Users ({allUsers.length})</h2>
              <AdminUserTable initialUsers={allUsers} currentAdminId={userId} />
            </div>

            {/* Feedbacks Box */}
            <div className="profile-card">
              <h2 className="profile-card-title">💬 Admin Console: User Support &amp; Feedback Inbox</h2>
              <FeedbackList />
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
