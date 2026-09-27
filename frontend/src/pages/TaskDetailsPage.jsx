import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import StatusBadge from '../components/StatusBadge'

import {
  deleteTask,
  getTaskById,
  isTaskOverdue,
  updateTaskStatus,
} from '../services/taskService'

const DEMO_MANAGER = {
  _id: 'mock-manager-1',
  name: 'Jane Manager',
  role: 'manager',
  department: {
    _id: 'mock-department-1',
    name: 'Academic',
  },
}

const getId = (value) =>
  typeof value === 'string' ? value : value?._id

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: value.includes('T')
      ? 'short'
      : undefined,
  }).format(date)
}

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Something went wrong.'

function TaskDetailsPage({
  taskId: suppliedTaskId,
  currentUser = DEMO_MANAGER,
}) {
  const { id: routeTaskId } = useParams()
  const navigate = useNavigate()

  const taskId =
    suppliedTaskId || routeTaskId

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [updatingStatus, setUpdatingStatus] =
    useState(false)

  const role = currentUser?.role
  const currentUserId = getId(currentUser)

  const isAdmin = role === 'admin'
  const isManager = role === 'manager'
  const isEmployee = role === 'employee'

  const managerOwnsTask =
    isManager &&
    getId(task?.department) ===
      getId(currentUser?.department)

  const isAssignedEmployee =
    isEmployee &&
    getId(task?.assignedTo) === currentUserId

  const canManage =
    isAdmin || managerOwnsTask

  const canView =
    isAdmin ||
    managerOwnsTask ||
    isAssignedEmployee

  useEffect(() => {
    let active = true

    const loadTask = async () => {
      if (!taskId) {
        setError('No task ID was provided.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const result = await getTaskById(taskId)

        if (!active) return

        if (!result) {
          setTask(null)
          setError('Task not found.')
        } else {
          setTask(result)
        }
      } catch (loadError) {
        if (active) {
          setError(
            getErrorMessage(loadError)
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadTask()

    return () => {
      active = false
    }
  }, [taskId])

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value

    setError('')
    setNotice('')
    setUpdatingStatus(true)

    try {
      const updatedTask =
        await updateTaskStatus(
          task._id,
          nextStatus
        )

      setTask(updatedTask)
      setNotice('Task status updated.')
    } catch (statusError) {
      setError(
        getErrorMessage(statusError)
      )
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    )

    if (!confirmed) return

    setError('')
    setDeleting(true)

    try {
      await deleteTask(task._id)
      navigate('/tasks')
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError)
      )
      setDeleting(false)
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
        <h1>Task details</h1>

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

  if (!canView) {
    return (
      <main>
        <h1>Task unavailable</h1>

        <p role="alert">
          You do not have permission to view
          this task.
        </p>

        <Link to="/tasks">
          Back to tasks
        </Link>
      </main>
    )
  }

  const overdue = isTaskOverdue(task)

  return (
    <main
      style={{
        margin: '0 auto',
        maxWidth: '900px',
        padding: '2rem 1rem',
      }}
    >
      <p>
        <Link to="/tasks">
          ← Back to tasks
        </Link>
      </p>

      <header
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1>{task.title}</h1>

          <StatusBadge
            status={task.status}
          />
        </div>

        {canManage && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
            }}
          >
            <Link
              to={`/tasks/${task._id}/edit`}
              style={{
                display: 'inline-block',
                padding: '0.5rem 0.75rem',
              }}
            >
              Edit task
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{ color: '#b42318' }}
            >
              {deleting
                ? 'Deleting…'
                : 'Delete task'}
            </button>
          </div>
        )}
      </header>

      {error && (
        <p
          role="alert"
          style={{ color: '#b42318' }}
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          style={{ color: '#176b35' }}
        >
          {notice}
        </p>
      )}

      <section
        aria-labelledby="task-description-heading"
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          marginTop: '1.5rem',
          padding: '1.25rem',
        }}
      >
        <h2 id="task-description-heading">
          Description
        </h2>

        <p style={{ whiteSpace: 'pre-wrap' }}>
          {task.description ||
            'No description provided.'}
        </p>

        <dl
          style={{
            display: 'grid',
            gap: '1rem 2rem',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          <div>
            <dt>Assigned to</dt>
            <dd>
              {task.assignedTo?.name ||
                'Unassigned'}
            </dd>
          </div>

          <div>
            <dt>Assignee email</dt>
            <dd>
              {task.assignedTo?.email ||
                '—'}
            </dd>
          </div>

          <div>
            <dt>Position</dt>
            <dd>
              {task.assignedTo?.position ||
                '—'}
            </dd>
          </div>

          <div>
            <dt>Assigned by</dt>
            <dd>
              {task.assignedBy?.name ||
                '—'}
            </dd>
          </div>

          <div>
            <dt>Department</dt>
            <dd>
              {task.department?.name ||
                '—'}
            </dd>
          </div>

          <div>
            <dt>Priority</dt>
            <dd>
              {task.priority
                ? `${task.priority[0].toUpperCase()}${task.priority.slice(1)}`
                : '—'}
            </dd>
          </div>

          <div>
            <dt>Due date</dt>
            <dd
              style={{
                color: overdue
                  ? '#b42318'
                  : 'inherit',
              }}
            >
              {formatDate(task.dueDate)}

              {overdue && (
                <strong>
                  {' '}
                  · Overdue
                </strong>
              )}
            </dd>
          </div>

          <div>
            <dt>Completed at</dt>
            <dd>
              {formatDate(task.completedAt)}
            </dd>
          </div>

          <div>
            <dt>Created</dt>
            <dd>
              {formatDate(task.createdAt)}
            </dd>
          </div>

          <div>
            <dt>Last updated</dt>
            <dd>
              {formatDate(task.updatedAt)}
            </dd>
          </div>
        </dl>
      </section>

      {isAssignedEmployee && (
        <section
          aria-labelledby="update-status-heading"
          style={{ marginTop: '1.5rem' }}
        >
          <h2 id="update-status-heading">
            Update your progress
          </h2>

          <label htmlFor="task-status">
            Task status
          </label>{' '}

          <select
            id="task-status"
            value={task.status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
          >
            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          {updatingStatus && (
            <span
              role="status"
              aria-live="polite"
              style={{ marginLeft: '0.5rem' }}
            >
              Updating…
            </span>
          )}
        </section>
      )}
    </main>
  )
}

export default TaskDetailsPage