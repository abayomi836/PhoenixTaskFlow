import { useEffect, useState } from 'react'
import { getUsers } from '../services/userService'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Unable to load employees.'

function EmployeesPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getUsers()

        if (active) {
          setUsers((data.users || []).filter((user) => user.role === 'employee'))
          setPagination(data.pagination || null)
        }
      } catch (usersError) {
        if (active) {
          setError(getErrorMessage(usersError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="employees-page">
      <header className="page-header">
  <div>
    <p className="page-eyebrow">EMPLOYEE MANAGEMENT</p>
    <h1>Employees</h1>
    <p className="page-description">
      View employees in your department.
    </p>
  </div>
</header>

      {loading && (
        <p role="status" aria-live="polite">
          Loading employees...
        </p>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <section aria-labelledby="employees-heading">
          <h2 id="employees-heading">Employee List</h2>

          {users.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <div className="table-container">
  <table className="table">
    <caption>Employees in your department</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Position</th>
        <th scope="col">Department</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.position || '—'}</td>
          <td>{user.department?.name || '—'}</td>
          <td>
  <span className="employee-role-badge">
    {user.role}
  </span>
</td>

<td>
  <span
    className={
      user.isActive
        ? 'employee-status-badge employee-status-active'
        : 'employee-status-badge employee-status-inactive'
    }
  >
    {user.isActive ? 'Active' : 'Inactive'}
  </span>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          )}

          <p>
  Showing {users.length} employee
  {users.length === 1 ? '' : 's'}
</p>
        </section>
      )}
    </main>
  )
}

export default EmployeesPage