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
    <article
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'grid',
        gap: '1rem',
        padding: '1.25rem',
      }}
    >
      <header
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.4rem' }}>
            {task.title}
          </h2>
          <p style={{ color: '#475569', margin: 0 }}>
            {task.description}
          </p>
        </div>

        <StatusBadge status={task.status} />
      </header>

      <dl
        style={{
          display: 'grid',
          gap: '0.75rem 1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          margin: 0,
        }}
      >
        <div>
          <dt style={{ color: '#64748b', fontSize: '0.8rem' }}>Assigned to</dt>
          <dd style={{ margin: '0.2rem 0 0' }}>
            {task.assignedTo?.name || 'Unassigned'}
          </dd>
        </div>

        <div>
          <dt style={{ color: '#64748b', fontSize: '0.8rem' }}>Priority</dt>
          <dd style={{ margin: '0.2rem 0 0' }}>
            {priorityLabels[task.priority] || 'Unknown'}
          </dd>
        </div>

        <div>
          <dt style={{ color: '#64748b', fontSize: '0.8rem' }}>Due date</dt>
          <dd
            style={{
              color: overdue ? '#b42318' : 'inherit',
              fontWeight: overdue ? 600 : 400,
              margin: '0.2rem 0 0',
            }}
          >
            {formatDueDate(task.dueDate)}
            {overdue && (
              <span aria-label="This task is overdue"> · Overdue</span>
            )}
          </dd>
        </div>

        <div>
          <dt style={{ color: '#64748b', fontSize: '0.8rem' }}>Department</dt>
          <dd style={{ margin: '0.2rem 0 0' }}>
            {task.department?.name || '—'}
          </dd>
        </div>
      </dl>

      <footer
        style={{
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          paddingTop: '1rem',
        }}
      >
        {onView && (
          <button type="button" onClick={() => onView(task)}>
            View details
          </button>
        )}

        {canManage && onEdit && (
          <button type="button" onClick={() => onEdit(task)}>
            Edit task
          </button>
        )}

        {canManage && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            style={{ color: '#b42318' }}
          >
            Delete task
          </button>
        )}

        {canUpdateStatus && onStatusChange && (
          <label
            htmlFor={statusSelectId}
            style={{
              alignItems: 'center',
              display: 'inline-flex',
              gap: '0.5rem',
              marginLeft: 'auto',
            }}
          >
            Update status
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