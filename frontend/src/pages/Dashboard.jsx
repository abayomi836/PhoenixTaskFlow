import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
// TEMP: using mock auth until Member 2's real AuthContext is ready.
// Swap this back to: import { useAuth } from "../context/AuthContext";
import { useAuth } from "../services/mocks/mockUseAuth";
import "./Dashboard.css";

// Dashboard — role-aware statistics view (Member 4 scope)
//
// The backend already scopes these numbers to the logged-in user
// (admin: org-wide, manager: own department, employee: own tasks) —
// see contract §27.5. This component just renders whatever comes back;
// it does not compute or re-filter stats on the client.

const STATUS_LABELS = {
  pending: "Pending",
  "in-progress": "In progress",
  completed: "Completed",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(user?.role);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || "Couldn't load dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const effectiveRole = stats?.role ?? user?.role;
  const scopeLabel =
    effectiveRole === "admin"
      ? "Organization-wide"
      : effectiveRole === "manager"
      ? stats?.department?.name
        ? `${stats.department.name} department`
        : "Your department"
      : "Your tasks";

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="dashboard__scope">{scopeLabel}</p>
      </header>

      {loading && (
        <div className="dashboard__state" role="status" aria-live="polite">
          Loading statistics…
        </div>
      )}

      {!loading && error && (
        <div className="dashboard__state dashboard__state--error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <div className="dashboard__grid">
          <div className="dashboard__hero">
            <span className="dashboard__hero-value">
              {stats.tasks?.total ?? 0}
            </span>
            <span className="dashboard__hero-label">
              {stats.role === "employee" ? "Your assigned tasks" : "Open tasks"}
            </span>
          </div>

          <div className="dashboard__stats">
            <StatRow
              label={STATUS_LABELS.pending}
              value={stats.tasks?.pending}
            />
            <StatRow
              label={STATUS_LABELS["in-progress"]}
              value={stats.tasks?.inProgress}
            />
            <StatRow
              label={STATUS_LABELS.completed}
              value={stats.tasks?.completed}
              tone="completed"
            />
            <StatRow
              label="Overdue"
              value={stats.tasks?.overdue}
              tone={stats.tasks?.overdue > 0 ? "overdue" : undefined}
            />

            {/* Employees breakdown: confirmed for both manager and admin
                (active/inactive split). */}
            {(stats.role === "admin" || stats.role === "manager") &&
              stats.employees?.total != null && (
                <>
                  <StatRow label="Employees" value={stats.employees.total} />
                  {stats.employees.inactive != null &&
                    stats.employees.inactive > 0 && (
                      <StatRow
                        label="Inactive employees"
                        value={stats.employees.inactive}
                        tone="overdue"
                      />
                    )}
                </>
              )}

            {/* Departments: confirmed for admin only (org-wide). Managers
                don't get a departments count — they belong to one. */}
            {stats.role === "admin" && stats.departments?.total != null && (
              <>
                <StatRow
                  label="Departments"
                  value={stats.departments.total}
                />
                {stats.departments.inactive != null &&
                  stats.departments.inactive > 0 && (
                    <StatRow
                      label="Inactive departments"
                      value={stats.departments.inactive}
                      tone="overdue"
                    />
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, tone }) {
  return (
    <div className={`stat-row${tone ? ` stat-row--${tone}` : ""}`}>
      <span className="stat-row__value">{value ?? 0}</span>
      <span className="stat-row__label">{label}</span>
    </div>
  );
}
