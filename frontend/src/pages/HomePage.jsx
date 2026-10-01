import { Link } from 'react-router-dom'
import fullLogo from '../assets/ptf-full-logo.png'

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <img
            src={fullLogo}
            alt="PhoenixTASKFLOW"
            className="home-logo"
          />

          <p className="home-eyebrow">Employee Task Management</p>

          <h1>Assign. Track. Complete.</h1>

          <p className="home-description">
            PhoenixTASKFLOW helps organizations assign tasks, monitor progress,
            and keep teams focused on getting work completed.
          </p>

          <div className="home-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>

            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-features"
        aria-labelledby="features-heading"
      >
        <div className="home-section-header">
          <p className="home-eyebrow">Built for productive teams</p>
          <h2 id="features-heading">Everything your team needs to stay on track</h2>
          <p>
            Keep tasks organized, monitor progress, and give every team member
            a clear view of their responsibilities.
          </p>
        </div>

        <div className="home-feature-grid">
  <article className="home-feature-card">
    <div className="home-feature-icon" aria-hidden="true">
      ✓
    </div>

    <div className="home-feature-content">
      <h3>Assign Tasks</h3>
      <p>
        Create tasks and assign them to the right team members with clear
        priorities and deadlines.
      </p>
    </div>
  </article>

  <article className="home-feature-card">
    <div className="home-feature-icon" aria-hidden="true">
      →
    </div>

    <div className="home-feature-content">
      <h3>Track Progress</h3>
      <p>
        Monitor pending, in-progress, completed, and overdue tasks from
        one central workspace.
      </p>
    </div>
  </article>

  <article className="home-feature-card">
    <div className="home-feature-icon" aria-hidden="true">
      ↑
    </div>

    <div className="home-feature-content">
      <h3>Improve Productivity</h3>
      <p>
        Give managers and employees the information they need to stay
        organized and accountable.
      </p>
    </div>
  </article>
</div>
      </section>
    </main>
  )
}

export default HomePage