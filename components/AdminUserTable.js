"use client";

import { useState } from "react";

export default function AdminUserTable({ initialUsers, currentAdminId }) {
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (userId, name) => {
    if (userId === currentAdminId) {
      alert("You cannot delete your own admin account!");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to completely delete ${name || 'this user'}? This will remove all their DSA tracking progress and notes from the database forever.`);
    if (!confirmDelete) return;

    setDeletingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.filter(u => u._id !== userId));
      } else {
        alert(data.error || "Failed to delete user account.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!users.length) return <p style={{ color: "var(--text-muted)", padding: "1rem" }}>No users registered in the database.</p>;

  return (
    <div className="admin-users-table-wrapper" style={{ overflowX: "auto" }}>
      <table className="admin-users-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--border-dark)", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)" }}>User</th>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)" }}>Email</th>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)" }}>Status</th>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)" }}>Joined Date</th>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)" }}>Payment Record</th>
            <th style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.02)", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: "1px solid var(--border-dark)", fontSize: "0.875rem" }}>
              <td style={{ padding: "1rem" }}>{u.name || "Anonymous"}</td>
              <td style={{ padding: "1rem", color: "var(--text-muted)" }}>{u.email}</td>
              <td style={{ padding: "1rem" }}>
                <span className={`status-badge ${u.isPaid || u.role === "admin" ? "success" : "target"}`}>
                  {u.role === "admin" ? "Admin" : u.isPaid ? "Pro Lifetime" : "Free"}
                </span>
              </td>
              <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td style={{ padding: "1rem" }}>
                {u.paidAt ? (
                  <div>
                    <p style={{ color: "#34d399", fontWeight: "600", fontSize: "0.8rem" }}>Billed (₹149)</p>
                    <p className="mono" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{u.paymentId || "admin_bypass"}</p>
                  </div>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>—</span>
                )}
              </td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                {u._id === currentAdminId ? (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Active Self</span>
                ) : (
                  <button
                    onClick={() => handleDelete(u._id, u.name)}
                    disabled={deletingId === u._id}
                    className="btn-delete-user"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "#ef4444",
                      padding: "0.35rem 0.6rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      transition: "all 0.2s",
                      fontWeight: "600"
                    }}
                  >
                    {deletingId === u._id ? "Deleting..." : "🗑️ Delete"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
