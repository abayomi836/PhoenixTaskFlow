import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  setEmployeeActiveStatus,
} from "../services/employeeService";
// TEMP: using mock auth until Member 2's real AuthContext is ready.
// Swap this back to: import { useAuth } from "../context/AuthContext";
import { useAuth } from "../services/mocks/mockUseAuth";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDetailModal from "../components/EmployeeDetailModal";
import "./Employees.css";

// Employees — list view (Member 4 scope)
//
// Admin sees all employees org-wide; manager sees only their department
// (the backend scopes this server-side per the contract — this component
// doesn't filter anything itself, it just renders whatever comes back).
// Employees themselves shouldn't be able to reach this page at all — that's
// a routing/guard concern for Member 2's protected routes, not handled here.
//
// Activate/deactivate: per contract §2 (PATCH /users/:id), both admin
// (org-wide) and manager (own department) can toggle isActive. Employee
// role never sees this control.
//
// Row click opens a detail modal (view), which can switch into the same
// EmployeeForm used for create, now in edit mode. No dedicated
// /employees/:id route yet since routing is Member 2's territory.

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // for detail modal
  const [editingEmployee, setEditingEmployee] = useState(null); // for edit form

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const canCreate = user?.role === "admin";
  const canEdit = user?.role === "admin" || user?.role === "manager";
  const canToggleActive = user?.role === "admin" || user?.role === "manager";

  const refetch = async () => {
    setLoading(true);
    setError(null);
    await loadEmployees();
  };

  const handleCreate = async (employeeData) => {
    setSubmitting(true);
    try {
      await createEmployee(employeeData);
      setShowForm(false);
      await refetch(); // refetch so the new employee's real ID/shape comes from the source of truth
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (employeeData) => {
    setSubmitting(true);
    try {
      await updateEmployee(editingEmployee._id, employeeData);
      setEditingEmployee(null);
      setSelectedEmployee(null);
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (emp) => {
    setTogglingId(emp._id);
    const previous = employees;
    // optimistic update
    setEmployees((prev) =>
      prev.map((e) =>
        e._id === emp._id ? { ...e, isActive: !e.isActive } : e
      )
    );
    // keep the modal's view of the employee in sync too, if open
    setSelectedEmployee((prev) =>
      prev && prev._id === emp._id ? { ...prev, isActive: !prev.isActive } : prev
    );
    try {
      await setEmployeeActiveStatus(emp._id, !emp.isActive);
    } catch (err) {
      setEmployees(previous); // roll back on failure
      setSelectedEmployee((prev) =>
        prev && prev._id === emp._id ? { ...prev, isActive: emp.isActive } : prev
      );
      setError(
        err?.response?.data?.message || "Couldn't update employee status."
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="employees">
      <header className="employees__header">
        <div>
          <h1>Employees</h1>
          <p className="employees__scope">
            {user?.role === "admin" ? "Organization-wide" : "Your department"}
          </p>
        </div>
        {canCreate && !showForm && (
          <button
            className="employees__create-btn"
            type="button"
            onClick={() => setShowForm(true)}
          >
            + Add employee
          </button>
        )}
      </header>

      {showForm && (
        <div className="employees__form-wrapper">
          <EmployeeForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </div>
      )}

      {loading && (
        <div className="employees__state" role="status" aria-live="polite">
          Loading employees…
        </div>
      )}

      {!loading && error && (
        <div className="employees__state employees__state--error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="employees__state">No employees found.</div>
      )}

      {!loading && employees.length > 0 && (
        <table className="employees__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              {canToggleActive && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp._id}
                className="employees__row"
                onClick={() => setSelectedEmployee(emp)}
              >
                <td>
                  <div className="employees__name">{emp.name}</div>
                  <div className="employees__email">{emp.email}</div>
                </td>
                <td>{emp.position || "—"}</td>
                <td>{emp.department?.name || "—"}</td>
                <td className="employees__role">{emp.role}</td>
                <td>
                  <span
                    className={`employees__status employees__status--${
                      emp.isActive ? "active" : "inactive"
                    }`}
                  >
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {canToggleActive && (
                  <td>
                    <button
                      type="button"
                      className="employees__toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // don't also open the detail modal
                        handleToggleActive(emp);
                      }}
                      disabled={togglingId === emp._id}
                    >
                      {togglingId === emp._id
                        ? "…"
                        : emp.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedEmployee && !editingEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          canEdit={canEdit}
          canToggleActive={canToggleActive}
          toggling={togglingId === selectedEmployee._id}
          onToggleActive={handleToggleActive}
          onEdit={(emp) => setEditingEmployee(emp)}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {editingEmployee && (
        <div className="employees__form-overlay" onClick={() => setEditingEmployee(null)}>
          <div
            className="employees__form-wrapper employees__form-wrapper--modal"
            onClick={(e) => e.stopPropagation()}
          >
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={handleUpdate}
              onCancel={() => setEditingEmployee(null)}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
