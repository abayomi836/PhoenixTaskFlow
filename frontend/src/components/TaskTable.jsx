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

function TaskTable({
  tasks = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  canManage = false,
  canUpdateStatus = false,
}) {
  return (
    <div
  className="task-table-container">
    
      <table className="task-table">
        <caption className="visually-hidden">
          Tasks, assignees, priorities, deadlines, and current status
        </caption>

        <thead>
          <tr>
            {[
              'Task',
              'Assignee',
              'Department',
              'Priority',
              'Due date',
              'Status',
              'Actions',
            ].map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} className="task-table-empty">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const overdue = isTaskOverdue(task)
              const statusSelectId = `table-task-status-${task._id}`

              return (
                <tr key={task._id}>
                  <th scope="row" className="task-table-title">
                    <div>{task.title}</div>

                    {task.description && (
                      <div className="task-table-description">
                        {task.description}
                      </div>
                    )}
                  </th>

                  <td>
                    {task.assignedTo?.name || 'Unassigned'}
                  </td>

                  <td>
                    {task.department?.name || '—'}
                  </td>

                  <td>
                    <span className={`priority-text priority-${task.priority}`}>
                      {priorityLabels[task.priority] || 'Unknown'}
                    </span>
                  </td>

                  <td className={overdue ? 'task-overdue' : ''}>
                    {formatDueDate(task.dueDate)}

                    {overdue && (
                      <div className="task-overdue-label">
                        Overdue
                      </div>
                    )}
                  </td>

                  <td>
                    <StatusBadge status={task.status} />

                    {canUpdateStatus && onStatusChange && (
                      <div className="task-status-control">
                        <label htmlFor={statusSelectId}>
                          Update status
                        </label>

                        <select
                          id={statusSelectId}
                          value={task.status}
                          onChange={(event) =>
                            onStatusChange(
                              task._id,
                              event.target.value,
                            )
                          }
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
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="task-table-actions">
                      {onView && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onView(task)}
                          aria-label={`View ${task.title}`}
                        >
                          View
                        </button>
                      )}

                      {canManage && onEdit && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEdit(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          Edit
                        </button>
                      )}

                      {canManage && onDelete && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(task)}
                          aria-label={`Delete ${task.title}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable