// employeeService.js
// API layer for Employee management (Member 4 — Dashboard, Employees & Departments)
//
// Assumes a shared, pre-configured axios instance from services/api.js
// (owned by Member 2 — handles baseURL + JWT auth header via interceptor).
//
// Every backend response follows: { success, message, data }
// so each function here unwraps `.data.data` and lets errors bubble up
// to the calling component, which is responsible for showing them.
//
// MOCK MODE: while GET /api/users' exact shape isn't confirmed, set
// VITE_USE_MOCKS=true in your local .env to use fake data instead.
// Remove this toggle (and mocks/mockEmployees.js) once the real API
// is confirmed working — don't ship it.

import api from "./api";
import { getMockEmployees, getMockEmployeeById, createMockEmployee, updateMockEmployee } from "./mocks/mockEmployees";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

/**
 * Get employees.
 * - Admin: returns all employees (org-wide).
 * - Manager: backend automatically scopes this to the manager's own department.
 * Supports pagination via query params (contract §27.4).
 *
 * @param {Object} params - { page, limit, search, department }
 */
export const getEmployees = async (params = {}) => {
  if (USE_MOCKS) {
    return getMockEmployees(params);
  }
  const response = await api.get("/users", { params });
  return response.data.data; // plain array (contract: pagination "can be added later" — not yet implemented)
};

/**
 * Get a single employee's details.
 * @param {string} id - User _id
 */
export const getEmployeeById = async (id) => {
  if (USE_MOCKS) {
    return getMockEmployeeById(id);
  }
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

/**
 * Create a new employee (admin only — backend enforces this, but the UI
 * should also hide this action from non-admins).
 * @param {Object} employeeData - { name, email, password, role, position, department }
 */
export const createEmployee = async (employeeData) => {
  if (USE_MOCKS) {
    return createMockEmployee(employeeData);
  }
  const response = await api.post("/users", employeeData);
  return response.data.data;
};

/**
 * Update an employee's editable fields (name, position, department, etc).
 * Role changes to admin/manager go through this same endpoint per the backend
 * contract, but the UI must only expose that control to authorized roles.
 * @param {string} id
 * @param {Object} updates
 */
export const updateEmployee = async (id, updates) => {
  if (USE_MOCKS) {
    return updateMockEmployee(id, updates);
  }
  const response = await api.patch(`/users/${id}`, updates);
  return response.data.data;
};

/**
 * Activate or deactivate an employee.
 * Deactivated employees cannot receive new task assignments (contract §27.2) —
 * reflect that in the UI (e.g. disable "assign" actions for inactive users
 * elsewhere in the app, though that's Member 3's task UI, not yours).
 * @param {string} id
 * @param {boolean} isActive
 */
export const setEmployeeActiveStatus = async (id, isActive) => {
  if (USE_MOCKS) {
    return updateMockEmployee(id, { isActive });
  }
  const response = await api.patch(`/users/${id}`, { isActive });
  return response.data.data;
};

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  setEmployeeActiveStatus,
};
