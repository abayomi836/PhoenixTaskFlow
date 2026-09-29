import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main>
      <section>
        <h1>Welcome to PhoenixTASKFLOW</h1>

        <p>
          Assign. Track. Complete.
        </p>

        <p>
          PhoenixTASKFLOW is an employee task management system that helps
          organizations assign tasks, monitor progress, and manage work
          efficiently.
        </p>

        <div>
          <Link to="/login">Login</Link>
          {' '}
          <Link to="/register">Create an Account</Link>
        </div>
      </section>
    </main>
  )
}

export default HomePage