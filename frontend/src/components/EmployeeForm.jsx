import { useEffect, useState } from "react";
import { getDepartments } from "../services/departmentService";
import "./EmployeeForm.css";

// EmployeeForm — create AND edit form (Member 4 scope)
//
// Per contract §10, POST /api/users is admin-only, and PATCH /api/users/:id
// allows both admin (org-wide) and manager (own department). The parent
// page is responsible for only rendering/opening this form for authorized
// users — this component doesn't re-check role itself, since it has no
// access to auth context on its own (keep it a dumb, reusable form).
//
// Pass an `employee` prop to switch into edit mode (prefills fields, calls
// onSubmit with only the changed shape expected by PATCH). Omit it (or
// pass null) for create mode.
//
// Departments are now fetched live via departmentService (respects
// VITE_USE_MOCKS the same way the rest of the app does) instead of being
// hardcoded — this only shows active departments, since a deactivated one
// shouldn't be assignable to new or edited employees.

const ROLE_OPTIONS = ["employee", "manager", "admin"];

export default function EmployeeForm({ employee, onSubmit, onCancel, submitting }) {
  const isEditMode = Boolean(employee);
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);

  const [form, setForm] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    position: employee?.position || "",
    departmentId: employee?.department?._id || "",
    role: employee?.role || "employee",
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDepartments();
        if (!cancelled) {
          setDepartments(data.filter((d) => d.isActive));
        }
      } catch {
        // form can still function without the dropdown populated; the
        // error will surface naturally if the user tries to submit without
        // picking a department, or department stays unassigned
      } finally {
        if (!cancelled) setDepartmentsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    const department = departments.find((d) => d._id === form.departmentId);

    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        department: department || null,
        role: form.role,
      });
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          `Couldn't ${isEditMode ? "update" : "create"} employee.`
      );
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2>{isEditMode ? `Edit ${employee.name}` : "Add employee"}</h2>

      {formError && (
        <div className="employee-form__error" role="alert">
          {formError}
        </div>
      )}

      <label className="employee-form__field">
        <span>Name</span>
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          required
        />
      </label>

      <label className="employee-form__field">
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
        />
      </label>

      <label className="employee-form__field">
        <span>Position</span>
        <input
          type="text"
          value={form.position}
          onChange={handleChange("position")}
          placeholder="e.g. Teacher, Accountant"
        />
      </label>

      <label className="employee-form__field">
        <span>Department</span>
        <select
          value={form.departmentId}
          onChange={handleChange("departmentId")}
          disabled={departmentsLoading}
        >
          <option value="">
            {departmentsLoading ? "Loading departments…" : "Select a department"}
          </option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <label className="employee-form__field">
        <span>Role</span>
        <select value={form.role} onChange={handleChange("role")}>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <div className="employee-form__actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="employee-form__submit" disabled={submitting}>
          {submitting
            ? isEditMode
              ? "Saving…"
              : "Creating…"
            : isEditMode
            ? "Save changes"
            : "Create employee"}
        </button>
      </div>
    </form>
  );
}
