import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
} from "../services/departmentService";
// TEMP: using mock auth until Member 2's real AuthContext is ready.
// Swap this back to: import { useAuth } from "../context/AuthContext";
import { useAuth } from "../services/mocks/mockUseAuth";
import DepartmentForm from "../components/DepartmentForm";
import "./Departments.css";

// Departments — list view (Member 4 scope)
//
// Per contract §7/§10: any authenticated role can VIEW departments (needed
// for dropdowns elsewhere in the app), but create/edit/deactivate are
// admin-only. Manager and employee see a read-only list, no action buttons.
//
// "Deactivate" is soft (isActive: false), not a hard delete, since existing
// users may still reference the department — matches the same pattern as
// employee activate/deactivate.

export default function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const isAdmin = user?.role === "admin";

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    await loadDepartments();
  };

  const handleCreate = async (deptData) => {
    setSubmitting(true);
    try {
      await createDepartment(deptData);
      setShowForm(false);
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (deptData) => {
    setSubmitting(true);
    try {
      await updateDepartment(editingDept._id, deptData);
      setEditingDept(null);
      await refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (dept) => {
    if (!window.confirm(`Deactivate ${dept.name}? Employees in this department will remain, but it can no longer be assigned to new hires or tasks.`)) {
      return;
    }
    setDeactivatingId(dept._id);
    const previous = departments;
    setDepartments((prev) =>
      prev.map((d) => (d._id === dept._id ? { ...d, isActive: false } : d))
    );
    try {
      await deactivateDepartment(dept._id);
    } catch (err) {
      setDepartments(previous);
      setError(err?.response?.data?.message || "Couldn't deactivate department.");
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <div className="departments">
      <header className="departments__header">
        <div>
          <h1>Departments</h1>
          <p className="departments__scope">Organization-wide</p>
        </div>
        {isAdmin && !showForm && (
          <button
            className="departments__create-btn"
            type="button"
            onClick={() => setShowForm(true)}
          >
            + Add department
          </button>
        )}
      </header>

      {showForm && (
        <div className="departments__form-wrapper">
          <DepartmentForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </div>
      )}

      {editingDept && (
        <div
          className="departments__form-overlay"
          onClick={() => setEditingDept(null)}
        >
          <div
            className="departments__form-wrapper departments__form-wrapper--modal"
            onClick={(e) => e.stopPropagation()}
          >
            <DepartmentForm
              department={editingDept}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDept(null)}
              submitting={submitting}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="departments__state" role="status" aria-live="polite">
          Loading departments…
        </div>
      )}

      {!loading && error && (
        <div className="departments__state departments__state--error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && departments.length === 0 && (
        <div className="departments__state">No departments found.</div>
      )}

      {!loading && departments.length > 0 && (
        <div className="departments__grid">
          {departments.map((dept) => (
            <div key={dept._id} className="departments__card">
              <div className="departments__card-header">
                <h3>{dept.name}</h3>
                <span
                  className={`departments__status departments__status--${
                    dept.isActive ? "active" : "inactive"
                  }`}
                >
                  {dept.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="departments__description">
                {dept.description || "No description provided."}
              </p>
              {isAdmin && (
                <div className="departments__card-actions">
                  <button
                    type="button"
                    onClick={() => setEditingDept(dept)}
                  >
                    Edit
                  </button>
                  {dept.isActive && (
                    <button
                      type="button"
                      className="departments__deactivate-btn"
                      onClick={() => handleDeactivate(dept)}
                      disabled={deactivatingId === dept._id}
                    >
                      {deactivatingId === dept._id ? "…" : "Deactivate"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
