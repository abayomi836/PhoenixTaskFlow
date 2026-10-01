import { isTaskOverdue } from '../services/taskService'
import StatusBadge from './StatusBadge'

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const formatDueDate = (dueDate) => {
  const date = new Date(dueDate)

  if (Number.isNaN(date.getTime())) return 'No due date'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(date)
}

function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canManage = false,
  canUpdateStatus = false,
}) {
  const overdue = isTaskOverdue(task)
  const statusSelectId = `task-status-${task._id}`

  return (
  <article className="task-card">
    <header className="task-card-header">
      <div>
        <h2 className="task-card-title">
          {task.title}
        </h2>

        <p className="task-card-description">
          {task.description}
        </p>
      </div>

      <StatusBadge status={task.status} />
    </header>

    <dl className="task-card-details">
      <div>
        <dt>Assigned to</dt>
        <dd>
          {task.assignedTo?.name || 'Unassigned'}
        </dd>
      </div>

      <div>
        <dt>Priority</dt>
        <dd className={`priority-text priority-${task.priority}`}>
          {priorityLabels[task.priority] || 'Unknown'}
        </dd>
      </div>

      <div>
        <dt>Due date</dt>
        <dd className={overdue ? 'task-overdue' : ''}>
          {formatDueDate(task.dueDate)}

          {overdue && (
            <span aria-label="This task is overdue">
              {' · Overdue'}
            </span>
          )}
        </dd>
      </div>

      <div>
        <dt>Department</dt>
        <dd>
          {task.department?.name || '—'}
        </dd>
      </div>
    </dl>

    <footer className="task-card-footer">
      {onView && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onView(task)}
        >
          View details
        </button>
      )}

      {canManage && onEdit && (
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(task)}
        >
          Edit task
        </button>
      )}

      {canManage && onDelete && (
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task)}
        >
          Delete task
        </button>
      )}

      {canUpdateStatus && onStatusChange && (
        <label
          htmlFor={statusSelectId}
          className="task-card-status-control"
        >
          <span>Update status</span>

          <select
            id={statusSelectId}
            value={task.status}
            onChange={(event) =>
              onStatusChange(task._id, event.target.value)
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      )}
    </footer>
  </article>
)
}

export default TaskCard