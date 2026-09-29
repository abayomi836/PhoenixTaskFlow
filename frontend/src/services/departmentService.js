// departmentService.js
// API layer for Department management (Member 4 — Dashboard, Employees & Departments)
//
// Departments are admin-managed per the contract (§7, §10). Managers/employees
// can read department data (e.g. for dropdowns), but create/edit/delete should
// be hidden in the UI for non-admins — and will be rejected by the backend
// regardless, since authorization is enforced server-side.
//
// MOCK MODE: set VITE_USE_MOCKS=true in your local .env to use fake data
// instead of the real API. Remove this toggle (and mocks/mockDepartments.js)
// once the real endpoints are confirmed working — don't ship it.

import api from "./api";
import {
  getMockDepartments,
  getMockDepartmentById,
  createMockDepartment,
  updateMockDepartment,
  deactivateMockDepartment,
} from "./mocks/mockDepartments";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

/**
 * Get all departments. Available to any authenticated role (for dropdowns,
 * filters, etc), not just admins.
 */
export const getDepartments = async () => {
  if (USE_MOCKS) {
    return getMockDepartments();
  }
  const response = await api.get("/departments");
  return response.data.data;
};

/**
 * Get a single department's details.
 * @param {string} id
 */
export const getDepartmentById = async (id) => {
  if (USE_MOCKS) {
    return getMockDepartmentById(id);
  }
  const response = await api.get(`/departments/${id}`);
  return response.data.data;
};

/**
 * Create a department (admin only).
 * @param {Object} departmentData - { name, description }
 */
export const createDepartment = async (departmentData) => {
  if (USE_MOCKS) {
    return createMockDepartment(departmentData);
  }
  const response = await api.post("/departments", departmentData);
  return response.data.data;
};

/**
 * Update a department's name/description (admin only).
 * @param {string} id
 * @param {Object} updates
 */
export const updateDepartment = async (id, updates) => {
  if (USE_MOCKS) {
    return updateMockDepartment(id, updates);
  }
  const response = await api.patch(`/departments/${id}`, updates);
  return response.data.data;
};

/**
 * Deactivate a department (admin only). Contract implies soft-delete via
 * isActive rather than hard delete, since users still reference it —
 * confirm with the backend dev whether DELETE performs a soft or hard delete.
 * @param {string} id
 */
export const deactivateDepartment = async (id) => {
  if (USE_MOCKS) {
    return deactivateMockDepartment(id);
  }
  const response = await api.delete(`/departments/${id}`);
  return response.data.data;
};

export default {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
};