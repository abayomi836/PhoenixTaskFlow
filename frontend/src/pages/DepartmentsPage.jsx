import { useEffect, useState } from 'react'
import { getDepartments } from '../services/departmentService'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Unable to load departments.'

function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadDepartments = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getDepartments()

        if (active) {
          setDepartments(data)
        }
      } catch (departmentsError) {
        if (active) {
          setError(getErrorMessage(departmentsError))
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDepartments()

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="departments-page">
      <header className="page-header">
  <div>
    <p className="page-eyebrow">ORGANIZATION MANAGEMENT</p>
    <h1>Departments</h1>
    <p className="page-description">
      View the departments in the organization.
    </p>
  </div>
</header>

      {loading && (
        <p role="status" aria-live="polite">
          Loading departments...
        </p>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <section aria-labelledby="departments-heading">
          <h2 id="departments-heading">Department List</h2>

          {departments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            <div className="table-container">
  <table className="table">
    <caption>Organization departments</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      {departments.map((department) => (
        <tr key={department._id}>
          <td>{department.name}</td>
          <td>{department.description || '—'}</td>
          <td>{department.isActive ? 'Active' : 'Inactive'}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          )}
        </section>
      )}
    </main>
  )
}

export default DepartmentsPage