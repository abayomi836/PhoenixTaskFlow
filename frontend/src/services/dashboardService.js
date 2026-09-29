// dashboardService.js
// API layer for Dashboard statistics (Member 4 — Dashboard, Employees & Departments)
//
// The backend, not the frontend, determines the scope of these stats
// (contract §27.5): admin gets org-wide numbers, manager gets only their
// department's numbers, employee gets only their own task numbers.
// Never fetch the full task list here and compute stats client-side —
// always consume GET /api/dashboard/stats directly.
//
// MOCK MODE: while the real endpoint isn't ready, set VITE_USE_MOCKS=true
// in your .env to serve fake data instead. Remove this toggle (and the
// mocks/ folder) once the real API is confirmed working — don't ship it.

import api from "./api";
import { getMockDashboardStats } from "./mocks/mockDashboardStats";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === "true";

/**
 * Get dashboard statistics, already scoped to the authenticated user's role
 * by the backend.
 * @param {'admin'|'manager'|'employee'} [role] - only used in mock mode,
 *   where there's no real backend to do the scoping. In real mode this
 *   parameter is ignored — the backend infers role from the JWT.
 */
export const getDashboardStats = async (role) => {
  if (USE_MOCKS) {
    return getMockDashboardStats(role);
  }
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};

export default {
  getDashboardStats,
};
