import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { createUser, getUsers, updateUser } from '../services/userService'
import { getDepartments } from '../services/departmentService'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Unable to load employees.'

function EmployeesPage() {
  const { user } = useContext(AuthContext)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
const [departments, setDepartments] = useState([])

const [showCreateForm, setShowCreateForm] = useState(false)
const [newUser, setNewUser] = useState({
  name: '',
  email: '',
  password: '',
  role: 'employee',
  position: '',
  department: '',
})

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let active = true

    const loadUsers = async () => {
      setLoading(true)
      setError('')

      try {
        const [data, departmentData] = await Promise.all([
  getUsers(),
  getDepartments(),
])



if (active) {
  const visibleUsers =
    user?.role === 'admin'
      ? data.users || []
      : (data.users || []).filter((employee) => employee.role === 'employee')

  setUsers(visibleUsers)
  setPagination(data.pagination || null)
  setDepartments(departmentData || [])
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
    <p className="page-eyebrow">
      {user?.role === 'admin' ? 'USER MANAGEMENT' : 'EMPLOYEE MANAGEMENT'}
    </p>

    <h1>
      {user?.role === 'admin' ? 'Users' : 'Employees'}
    </h1>

    <p className="page-description">
      {user?.role === 'admin'
        ? 'View and manage users across the organization.'
        : 'View employees in your department.'}
    </p>
  </div>

  {user?.role === 'admin' && (
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setShowCreateForm(true)}
  >
    Create User
  </button>
  )}

</header>

      {loading && (
        <p role="status" aria-live="polite">
          Loading employees...
        </p>
      )}

      {error && <p role="alert">{error}</p>}
      {successMessage && (
  <p role="status" aria-live="polite">
    {successMessage}
  </p>
)}

      {!loading && !error && (
        <section aria-labelledby="employees-heading">
          <h2 id="employees-heading">
  {user?.role === 'admin' ? 'User List' : 'Employee List'}
</h2>

{showCreateForm && user?.role === 'admin' && (
  <div className="employee-edit-form">
    <h3>Create User</h3>

    <label>
      Name
      <input
        type="text"
        value={newUser.name}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            name: event.target.value,
          })
        }
      />
    </label>

    <label>
      Email
      <input
        type="email"
        value={newUser.email}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            email: event.target.value,
          })
        }
      />
    </label>

    <label>
      Password
      <input
        type="password"
        value={newUser.password}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            password: event.target.value,
          })
        }
      />
    </label>

    <label>
      Role
      <select
        value={newUser.role}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            role: event.target.value,
          })
        }
      >
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
    </label>

    <label>
      Position
      <input
        type="text"
        value={newUser.position}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            position: event.target.value,
          })
        }
      />
    </label>

    <label>
      Department
      <select
        value={newUser.department}
        onChange={(event) =>
          setNewUser({
            ...newUser,
            department: event.target.value,
          })
        }
      >
        <option value="">Select department</option>

        {departments.map((department) => (
          <option key={department._id} value={department._id}>
            {department.name}
          </option>
        ))}
      </select>
    </label>

    <div className="edit-task-actions">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setShowCreateForm(false)}
      >
        Cancel
      </button>

      <button
  type="button"
  className="btn btn-primary"
  onClick={async () => {
    setError('')

    setSuccessMessage('')

    try {
      const createdUser = await createUser(newUser)

      setUsers((currentUsers) => [
        ...currentUsers,
        createdUser,
      ])

      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        position: '',
        department: '',
      })

      setShowCreateForm(false)
      setSuccessMessage('User created successfully.')
    } catch (createError) {
      setError(getErrorMessage(createError))
    }
  }}
>
  Create User
</button>
    </div>
  </div>
)}

          {users.length === 0 ? (
  <p>No employees found.</p>
) : (
  <>
    <div className="table-container">
  <table className="table">
    <caption>
      {user?.role === 'admin'
        ? 'All users in the organization'
        : 'Employees in your department'}
    </caption>

    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Position</th>
        <th scope="col">Department</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>

        {user?.role === 'admin' && (
          <th scope="col">Actions</th>
        )}
      </tr>
    </thead>

    <tbody>
      {users.map((employee) => (
  <React.Fragment key={employee._id}>

          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.position || '—'}</td>
            <td>{employee.department?.name || '—'}</td>

            <td>
              <span className="employee-role-badge">
                {employee.role}
              </span>
            </td>

            <td>
              <span
                className={
                  employee.isActive
                    ? 'employee-status-badge employee-status-active'
                    : 'employee-status-badge employee-status-inactive'
                }
              >
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>

            {user?.role === 'admin' && (
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingUserId(employee._id)
                    setEditingUser(employee)
                  }}
                >
                  Edit
                </button>
              </td>
            )}
          </tr>

          {editingUser?._id === employee._id && user?.role === 'admin' && (
            <tr>
              <td colSpan="7">
                <div className="employee-edit-form">
                  <h3>Edit User</h3>

                  <p>
                    Editing: <strong>{editingUser.name}</strong>
                  </p>

                  <label>
                    Name
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          name: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      value={editingUser.email}
                      readOnly
                    />
                  </label>

                  <label>
                    Role
                    <select
                      value={editingUser.role}
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          role: event.target.value,
                        })
                      }
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <label>
                    Position
                    <input
                      type="text"
                      value={editingUser.position || ''}
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          position: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Department
                    <select
                      value={
                        editingUser.department?._id ||
                        editingUser.department ||
                        ''
                      }
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          department: event.target.value,
                        })
                      }
                    >
                      <option value="">Select department</option>

                      {departments.map((department) => (
                        <option
                          key={department._id}
                          value={department._id}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Status
                    <select
                      value={
                        editingUser.isActive
                          ? 'active'
                          : 'inactive'
                      }
                      onChange={(event) =>
                        setEditingUser({
                          ...editingUser,
                          isActive:
                            event.target.value === 'active',
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingUser(null)
                      setEditingUserId(null)
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true)
                      setError('')
                      setSuccessMessage('')

                      try {
                        const updatedUser = await updateUser(
                          editingUserId,
                          {
                            name: editingUser.name,
                            role: editingUser.role,
                            position: editingUser.position,
                            department:
                              editingUser.department?._id ||
                              editingUser.department,
                            isActive: editingUser.isActive,
                          }
                        )

                        const selectedDepartment =
                          departments.find(
                            (department) =>
                              department._id ===
                              updatedUser.department
                          )

                        setUsers((currentUsers) =>
                          currentUsers.map((currentUser) =>
                            currentUser._id === updatedUser._id
                              ? {
                                  ...currentUser,
                                  ...updatedUser,
                                  department:
                                    selectedDepartment ||
                                    currentUser.department,
                                }
                              : currentUser
                          )
                        )

                        setEditingUser(null)
                        setEditingUserId(null)
                        setSuccessMessage(
                          'User updated successfully.'
                        )
                      } catch (updateError) {
                        setError(
                          getErrorMessage(updateError)
                        )
                      } finally {
                        setSaving(false)
                      }
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>
  </>
)}

          <p>
  Showing {users.length}{' '}
  {user?.role === 'admin'
    ? `user${users.length === 1 ? '' : 's'}`
    : `employee${users.length === 1 ? '' : 's'}`}
</p>
        </section>
      )}
    </main>
  )
}

export default EmployeesPage