import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUsersCollection } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  let users = [];
  try {
    const usersCol = await getUsersCollection();
    users = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
  } catch (error) {
    console.error("Error fetching users for admin:", error);
  }

  const totalUsers = users.length;
  const paidUsers = users.filter((u) => u.isPaid).length;
  const conversionRate = totalUsers ? ((paidUsers / totalUsers) * 100).toFixed(1) : 0;
  const estimatedRevenue = paidUsers * 149;

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "#f1f5f9", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#fff" }}>👑 Admin Console</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage user access and track conversions</p>
          </div>
          <Link href="/dashboard" className="btn-primary btn-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
            ← Back to Dashboard
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#94a3b8" }}>Total Signups</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#fff", marginTop: "0.5rem" }}>{totalUsers}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#34d399" }}>Paid Users</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#34d399", marginTop: "0.5rem" }}>{paidUsers}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#8b5cf6" }}>Est. Revenue</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#a78bfa", marginTop: "0.5rem" }}>₹{estimatedRevenue}</h3>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", padding: "1.25rem", borderRadius: "1rem" }}>
            <p style={{ fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", color: "#fb923c" }}>Conversion Rate</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#fb923c", marginTop: "0.5rem" }}>{conversionRate}%</h3>
          </div>
        </div>

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
                  <th style={{ padding: "1rem 1.25rem" }}>Payment Status</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Schedule</th>
                  <th style={{ padding: "1rem 1.25rem" }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "0.9rem" }}>
                    <td style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <img src={u.image} alt={u.name} style={{ width: "2rem", height: "2rem", borderRadius: "50%" }} />
                      <div>
                        <div style={{ fontWeight: "600", color: "#fff" }}>{u.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.email}</div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "600", background: u.role === "admin" ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.06)", color: u.role === "admin" ? "#c084fc" : "#94a3b8", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "600", background: u.isPaid ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: u.isPaid ? "#34d399" : "#f87171", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>
                        {u.isPaid ? "Paid" : "Unpaid"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
