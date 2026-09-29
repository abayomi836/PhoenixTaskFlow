import "./EmployeeDetailModal.css";

// EmployeeDetailModal — read-only detail view (Member 4 scope)
//
// Opens when a row in the Employees table is clicked. Shows full employee
// info and offers Edit / Activate-Deactivate actions, scoped by role the
// same way the table itself is. This is a modal, not a routed page
// (/employees/:id), since routing belongs to Member 2 — if real routing
// exists later, this can be swapped for a route without changing the
// underlying logic much.

export default function EmployeeDetailModal({
  employee,
  canEdit,
  canToggleActive,
  toggling,
  onEdit,
  onToggleActive,
  onClose,
}) {
  if (!employee) return null;

  return (
    <div className="employee-modal__overlay" onClick={onClose}>
      <div
        className="employee-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-modal-title"
      >
        <div className="employee-modal__header">
          <h2 id="employee-modal-title">{employee.name}</h2>
          <button
            type="button"
            className="employee-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <dl className="employee-modal__details">
          <dt>Email</dt>
          <dd>{employee.email}</dd>

          <dt>Position</dt>
          <dd>{employee.position || "—"}</dd>

          <dt>Department</dt>
          <dd>{employee.department?.name || "—"}</dd>

          <dt>Role</dt>
          <dd className="employee-modal__role">{employee.role}</dd>

          <dt>Status</dt>
          <dd>
            <span
              className={`employee-modal__status employee-modal__status--${
                employee.isActive ? "active" : "inactive"
              }`}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </dd>
        </dl>

        <div className="employee-modal__actions">
          {canToggleActive && (
            <button
              type="button"
              onClick={() => onToggleActive(employee)}
              disabled={toggling}
            >
              {toggling
                ? "…"
                : employee.isActive
                ? "Deactivate"
                : "Activate"}
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              className="employee-modal__edit-btn"
              onClick={() => onEdit(employee)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
