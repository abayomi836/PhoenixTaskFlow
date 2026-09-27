const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
}

const statusColors = {
  pending: { background: '#fff4d6', color: '#805b00' },
  'in-progress': { background: '#e5f0ff', color: '#174ea6' },
  completed: { background: '#e3f5e9', color: '#176b35' },
}

function StatusBadge({ status }) {
  const label = statusLabels[status] || 'Unknown'
  const colors = statusColors[status] || {
    background: '#eeeeee',
    color: '#444444',
  }

  return (
    <span
      aria-label={`Task status: ${label}`}
      style={{
        ...colors,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        fontSize: '0.8rem',
        fontWeight: 600,
        lineHeight: 1.4,
        padding: '0.25rem 0.65rem',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export default StatusBadge