import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  createTask,
  getTaskAssignees,
} from '../services/taskService'

const getId = (value) =>
  typeof value === 'string' ? value : value?._id

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Something went wrong.'

const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function CreateTaskPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const role = user?.role
  const isAdmin = role === 'admin'
  const isManager = role === 'manager'
  const canCreate = isAdmin || isManager

  const managerDepartmentId = getId(user?.department)

  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadEmployees = async () => {
      try {
        const result = await getTaskAssignees()

        if (active) {
          setEmployees(result)
        }
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError))
        }
      } finally {
        if (active) {
          setEmployeesLoading(false)
        }
      }
    }

    loadEmployees()

    return () => {
      active = false
    }
  }, [])

  const eligibleEmployees = useMemo(() => {
    if (isAdmin) {
      return employees
    }

    if (isManager) {
      return employees.filter(
        (employee) =>
          getId(employee.department) ===
          managerDepartmentId,
      )
    }

    return []
  }, [
    employees,
    isAdmin,
    isManager,
    managerDepartmentId,
  ])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!canCreate) {
      setError(
        'You do not have permission to create tasks.',
      )
      return
    }

    if (isManager && !managerDepartmentId) {
      setError(
        'Your manager account is missing a department.',
      )
      return
    }

    if (!form.assignedTo) {
      setError('Please select an employee.')
      return
    }

    setSaving(true)

    try {
      const task = await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        assignedTo: form.assignedTo,
        priority: form.priority,
        dueDate: form.dueDate,
      })

      navigate(`/tasks/${task._id}`)
    } catch (submitError) {
      setError(getErrorMessage(submitError))
      setSaving(false)
    }
  }

  if (!canCreate) {
    return (
      <main className="create-task-page">

        <h1>Create task</h1>

        <p role="alert">
          You do not have permission to create tasks.
        </p>

        <Link to="/tasks">Back to tasks</Link>
      </main>
    )
  }

  return (
    <main className="create-task-page">

      <p>
  <Link to="/tasks">← Back to tasks</Link>
</p>

<header className="page-header">
  <div>
    <p className="page-eyebrow">WORK MANAGEMENT</p>

    <h1>Create task</h1>

    <p className="page-description">
      Assign a task to an active employee and set its
      priority and due date.
    </p>
  </div>
</header>

      {error && (
        <p
          role="alert"
          style={{ color: '#b42318' }}
        >
          {error}
        </p>
      )}

      {!employeesLoading &&
        eligibleEmployees.length === 0 && (
          <p role="status">
            No active employees are available in the
            permitted department.
          </p>
        )}

      <form
  onSubmit={handleSubmit}
  className="create-task-form"
>

        <label
          htmlFor="task-title"
          className="create-task-field"
        >

          Task title

          <input
            id="task-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            required
          />
        </label>

        <label
          htmlFor="task-description"
          className="create-task-field"
        >
          Description

          <textarea
            id="task-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            maxLength={2000}
            required
          />
        </label>

        <label
          htmlFor="task-assignee"
          className="create-task-field"
        >
          Assign to

          <select
            id="task-assignee"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            required
            disabled={
              employeesLoading ||
              eligibleEmployees.length === 0
            }
          >
            <option value="">
              {employeesLoading
                ? 'Loading employees…'
                : 'Select an employee'}
            </option>

            {eligibleEmployees.map((employee) => (
              <option
                key={employee._id}
                value={employee._id}
              >
                {employee.name} —{' '}
                {employee.position || 'Employee'}
              </option>
            ))}
          </select>
        </label>

        <label
          htmlFor="task-priority"
          className="create-task-field"
        >
          Priority

          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label
          htmlFor="task-due-date"
          className="create-task-field"
        >
          Due date

          <input
            id="task-due-date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            min={getTodayDate()}
            required
          />
        </label>

        <div className="create-task-actions">
          
          <button
  type="submit"
  className="btn btn-primary"
  disabled={
    saving ||
    employeesLoading ||
    eligibleEmployees.length === 0
  }
>
            {saving ? 'Creating…' : 'Create task'}
          </button>

          <Link to="/tasks" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}

export default CreateTaskPage