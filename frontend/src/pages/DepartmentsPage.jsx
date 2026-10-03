import { useEffect, useState } from 'react'
import { getDepartments, createDepartment } from '../services/departmentService'
import { useAuth } from '../hooks/useAuth'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Unable to load departments.'

function DepartmentsPage() {
  const { user } = useAuth()

  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const isAdmin = user?.role === 'admin'

  const loadDepartments = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch (departmentsError) {
      setError(getErrorMessage(departmentsError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadInitialDepartments = async () => {
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

    loadInitialDepartments()

    return () => {
      active = false
    }
  }, [])

  const handleCreateDepartment = async (event) => {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await createDepartment({
        name: name.trim(),
        description: description.trim(),
      })

      setName('')
      setDescription('')
      setShowForm(false)
      setSuccess('Department created successfully.')

      await loadDepartments()
    } catch (departmentError) {
      setError(getErrorMessage(departmentError))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setName('')
    setDescription('')
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  return (
    <main className="departments-page">
  <button
    type="button"
    className="page-back-button"
    onClick={() => window.history.back()}
  >
    ← Back
  </button>

  <header className="page-header">
        <div>
          <p className="page-eyebrow">ORGANIZATION MANAGEMENT</p>
          <h1>Departments</h1>
          <p className="page-description">
            View the departments in the organization.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true)
              setError('')
              setSuccess('')
            }}
          >
            Add Department
          </button>
        )}
      </header>

      {showForm && isAdmin && (
        <section
          className="form-card"
          aria-labelledby="create-department-heading"
        >
          <div className="form-card-header">
            <div>
              <p className="page-eyebrow">ORGANIZATION MANAGEMENT</p>
              <h2 id="create-department-heading">Add Department</h2>
            </div>
          </div>

          <form onSubmit={handleCreateDepartment}>
            <div className="form-group">
              <label htmlFor="department-name">Department Name</label>
              <input
                id="department-name"
                className="input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter department name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department-description">
                Description
              </label>
              <textarea
                id="department-description"
                className="input"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Enter department description"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Department'}
              </button>
            </div>
          </form>
        </section>
      )}

      {success && (
        <p role="status" aria-live="polite">
          {success}
        </p>
      )}

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
                      <td>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </td>
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