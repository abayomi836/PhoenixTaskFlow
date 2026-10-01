import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getDashboardStats } from '../services/dashboardService'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Unable to load dashboard statistics.'

function DashboardPage() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getDashboardStats()

        if (active) {
          setStats(data)
        }
      } catch (dashboardError) {
        if (active) {
          setError(getErrorMessage(dashboardError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <main>
        <h1>Dashboard</h1>

        <p role="status" aria-live="polite">
          Loading dashboard...
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Dashboard</h1>

        <p role="alert">
          {error}
        </p>
      </main>
    )
  }

    return (
    <main className="dashboard-page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Welcome back, {user?.name || 'User'}. Here's an overview of your
            current tasks and activity.
          </p>
        </div>
      </header>

      <section
        className="stats-section"
        aria-labelledby="task-statistics-heading"
      >
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Performance</p>
            <h2 id="task-statistics-heading">Task Statistics</h2>
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <div className="stat-card-label">Total Tasks</div>
            <div className="stat-card-value">{stats?.totalTasks ?? 0}</div>
            <div className="stat-card-meta">All assigned tasks</div>
          </article>

          <article className="stat-card">
            <div className="stat-card-label">Pending</div>
            <div className="stat-card-value">{stats?.pending ?? 0}</div>
            <div className="stat-card-meta">Awaiting action</div>
          </article>

          <article className="stat-card">
            <div className="stat-card-label">In Progress</div>
            <div className="stat-card-value">{stats?.inProgress ?? 0}</div>
            <div className="stat-card-meta">Currently active</div>
          </article>

          <article className="stat-card">
            <div className="stat-card-label">Completed</div>
            <div className="stat-card-value">{stats?.completed ?? 0}</div>
            <div className="stat-card-meta">Successfully completed</div>
          </article>

          <article className="stat-card stat-card-warning">
            <div className="stat-card-label">Overdue</div>
            <div className="stat-card-value">{stats?.overdue ?? 0}</div>
            <div className="stat-card-meta">Past their due date</div>
          </article>
        </div>
      </section>

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <section
          className="stats-section"
          aria-labelledby="organization-statistics-heading"
        >
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Organization</p>
              <h2 id="organization-statistics-heading">
                {user.role === 'admin'
                  ? 'Organization Statistics'
                  : 'Department Statistics'}
              </h2>
            </div>
          </div>

          <div className="stats-grid stats-grid-secondary">
            <article className="stat-card">
              <div className="stat-card-label">Employees</div>
              <div className="stat-card-value">
                {stats?.totalEmployees ?? 0}
              </div>
              <div className="stat-card-meta">Active employees</div>
            </article>

            {user.role === 'admin' && (
              <article className="stat-card">
                <div className="stat-card-label">Departments</div>
                <div className="stat-card-value">
                  {stats?.totalDepartments ?? 0}
                </div>
                <div className="stat-card-meta">Active departments</div>
              </article>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export default DashboardPage