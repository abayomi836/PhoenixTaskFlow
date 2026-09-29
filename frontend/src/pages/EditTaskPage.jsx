import { useEffect, useMemo, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import {
  getTaskAssignees,
  getTaskById,
  updateTask,
} from '../services/taskService'

const getId = (value) =>
  typeof value === 'string' ? value : value?._id

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Something went wrong.'

function EditTaskPage({
  taskId: suppliedTaskId,
}) {
  const { user } = useAuth()
  const { id: routeTaskId } = useParams()
  const navigate = useNavigate()

  const taskId = suppliedTaskId || routeTaskId

  const role = user?.role
  const isAdmin = role === 'admin'
  const isManager = role === 'manager'

  const managerDepartmentId = getId(
    user?.department,
  )

  const [task, setTask] = useState(null)
  const [employees, setEmployees] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  })

  useEffect(() => {
    let active = true

    const loadData = async () => {
      if (!taskId) {
        setError('No task ID was provided.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const [
          loadedTask,
          loadedEmployees,
        ] = await Promise.all([
          getTaskById(taskId),
          getTaskAssignees(),
        ])

        if (!active) {
          return
        }

        if (!loadedTask) {
          setTask(null)
          setEmployees(loadedEmployees)
          setError('Task not found.')
          return
        }

        setTask(loadedTask)
        setEmployees(loadedEmployees)

        setForm({
          title: loadedTask.title || '',
          description:
            loadedTask.description || '',
          assignedTo:
            getId(loadedTask.assignedTo) || '',
          priority:
            loadedTask.priority || 'medium',
          dueDate: loadedTask.dueDate
            ? loadedTask.dueDate.slice(0, 10)
            : '',
        })
      } catch (loadError) {
        if (active) {
          setError(
            getErrorMessage(loadError),
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [taskId])

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

  const managerOwnsTask =
    isManager &&
    getId(task?.department) ===
      managerDepartmentId

  const canEdit =
    isAdmin || managerOwnsTask

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

    if (!canEdit) {
      setError(
        'You do not have permission to edit this task.',
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
      const updatedTask = await updateTask(
        task._id,
        {
          title: form.title.trim(),
          description:
            form.description.trim(),
          assignedTo: form.assignedTo,
          priority: form.priority,
          dueDate: form.dueDate,
        },
      )

      if (!updatedTask) {
        setError('Task not found.')
        setSaving(false)
        return
      }

      navigate(
        `/tasks/${updatedTask._id}`,
      )
    } catch (saveError) {
      setError(
        getErrorMessage(saveError),
      )
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main>
        <p
          role="status"
          aria-live="polite"
        >
          Loading task…
        </p>
      </main>
    )
  }

  if (error && !task) {
    return (
      <main>
        <h1>Edit task</h1>

        <p
          role="alert"
          style={{ color: '#b42318' }}
        >
          {error}
        </p>

        <Link to="/tasks">
          Back to tasks
        </Link>
      </main>
    )
  }

  if (!task) {
    return null
  }

  if (!canEdit) {
    return (
      <main>
        <h1>Edit task</h1>

        <p role="alert">
          You do not have permission to edit
          this task.
        </p>

        <Link to={`/tasks/${task._id}`}>
          Back to task details
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{
        margin: '0 auto',
        maxWidth: '720px',
        padding: '2rem 1rem',
      }}
    >
      <p>
        <Link to={`/tasks/${task._id}`}>
          ← Back to task
        </Link>
      </p>

      <h1>Edit task</h1>

      {error && (
        <p
          role="alert"
          style={{ color: '#b42318' }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          display: 'grid',
          gap: '1rem',
          padding: '1.25rem',
        }}
      >
        <label
          htmlFor="task-title"
          style={{
            display: 'grid',
            gap: '0.35rem',
          }}
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
          style={{
            display: 'grid',
            gap: '0.35rem',
          }}
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
          style={{
            display: 'grid',
            gap: '0.35rem',
          }}
        >
          Assign to

          <select
            id="task-assignee"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            required
            disabled={
              eligibleEmployees.length === 0
            }
          >
            <option value="">
              Select an active employee
            </option>

            {eligibleEmployees.map(
              (employee) => (
                <option
                  key={employee._id}
                  value={employee._id}
                >
                  {employee.name} —{' '}
                  {employee.position ||
                    'Employee'}
                </option>
              ),
            )}
          </select>
        </label>

        {eligibleEmployees.length === 0 && (
          <p role="status">
            No active employees are
            available in the permitted
            department.
          </p>
        )}

        <label
          htmlFor="task-priority"
          style={{
            display: 'grid',
            gap: '0.35rem',
          }}
        >
          Priority

          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
          >
            <option value="low">
              Low
            </option>
            <option value="medium">
              Medium
            </option>
            <option value="high">
              High
            </option>
          </select>
        </label>

        <label
          htmlFor="task-due-date"
          style={{
            display: 'grid',
            gap: '0.35rem',
          }}
        >
          Due date

          <input
            id="task-due-date"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
          />
        </label>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '0.5rem',
          }}
        >
          <button
            type="submit"
            disabled={
              saving ||
              eligibleEmployees.length === 0
            }
          >
            {saving
              ? 'Saving…'
              : 'Save changes'}
          </button>

          <Link
            to={`/tasks/${task._id}`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  )
}

export default EditTaskPage