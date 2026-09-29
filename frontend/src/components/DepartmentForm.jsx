import { useState } from "react";
import "./DepartmentForm.css";

// DepartmentForm — create AND edit form (Member 4 scope)
//
// Per contract §7/§10, department create/edit/delete is admin-only. The
// parent page is responsible for only rendering this for admin users.
//
// Pass a `department` prop to switch into edit mode (prefills fields).
// Omit it (or pass null) for create mode.

export default function DepartmentForm({ department, onSubmit, onCancel, submitting }) {
  const isEditMode = Boolean(department);

  const [form, setForm] = useState({
    name: department?.name || "",
    description: department?.description || "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("Department name is required.");
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
      });
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          `Couldn't ${isEditMode ? "update" : "create"} department.`
      );
    }
  };

  return (
    <form className="department-form" onSubmit={handleSubmit}>
      <h2>{isEditMode ? `Edit ${department.name}` : "Add department"}</h2>

      {formError && (
        <div className="department-form__error" role="alert">
          {formError}
        </div>
      )}

      <label className="department-form__field">
        <span>Name</span>
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          required
        />
      </label>

      <label className="department-form__field">
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          rows={3}
          placeholder="What does this department handle?"
        />
      </label>

      <div className="department-form__actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="department-form__submit" disabled={submitting}>
          {submitting
            ? isEditMode
              ? "Saving…"
              : "Creating…"
            : isEditMode
            ? "Save changes"
            : "Create department"}
        </button>
      </div>
    </form>
  );
}
