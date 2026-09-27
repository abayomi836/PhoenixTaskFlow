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
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          minWidth: '780px',
          textAlign: 'left',
          width: '100%',
        }}
      >
        <caption
          style={{
            height: '1px',
            overflow: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: '1px',
            clipPath: 'inset(50%)',
          }}
        >
          Tasks, assignees, priorities, deadlines, and current status
        </caption>

        <thead>
          <tr>
            {['Task', 'Assignee', 'Department', 'Priority', 'Due date', 'Status', 'Actions'].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  style={{
                    borderBottom: '2px solid #cbd5e1',
                    color: '#475569',
                    fontSize: '0.8rem',
                    padding: '0.75rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  color: '#64748b',
                  padding: '2rem 0.75rem',
                  textAlign: 'center',
                }}
              >
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const overdue = isTaskOverdue(task)
              const statusSelectId = `table-task-status-${task._id}`

              return (
                <tr key={task._id}>
                  <th
                    scope="row"
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      fontWeight: 600,
                      minWidth: '180px',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    <div>{task.title}</div>
                    {task.description && (
                      <div
                        style={{
                          color: '#64748b',
                          fontSize: '0.85rem',
                          fontWeight: 400,
                          marginTop: '0.25rem',
                          maxWidth: '280px',
                        }}
                      >
                        {task.description}
                      </div>
                    )}
                  </th>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    {task.assignedTo?.name || 'Unassigned'}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    {task.department?.name || '—'}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    {priorityLabels[task.priority] || 'Unknown'}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      color: overdue ? '#b42318' : 'inherit',
                      fontWeight: overdue ? 600 : 400,
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDueDate(task.dueDate)}
                    {overdue && (
                      <div aria-label="This task is overdue">Overdue</div>
                    )}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    <StatusBadge status={task.status} />

                    {canUpdateStatus && onStatusChange && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <label
                          htmlFor={statusSelectId}
                          style={{
                            display: 'block',
                            fontSize: '0.8rem',
                            marginBottom: '0.25rem',
                          }}
                        >
                          Update status
                        </label>
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
                      </div>
                    )}
                  </td>

                  <td
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      padding: '0.85rem 0.75rem',
                      verticalAlign: 'top',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                      }}
                    >
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(task)}
                          aria-label={`View ${task.title}`}
                        >
                          View
                        </button>
                      )}

                      {canManage && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          Edit
                        </button>
                      )}

                      {canManage && onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(task)}
                          aria-label={`Delete ${task.title}`}
                          style={{ color: '#b42318' }}
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