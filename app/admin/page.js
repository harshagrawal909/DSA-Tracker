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
    }
  }, [status, session, router]);

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

  const stats = useMemo(() => {
    const total = users.length;
    const paid = users.filter((u) => u.isPaid).length;
    const rate = total ? ((paid / total) * 100).toFixed(1) : 0;
    const revenue = paid * 149;
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
