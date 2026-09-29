// mockDashboardStats.js
// Fake data standing in for GET /api/dashboard/stats until the real backend
// endpoint is live.
//
// All three role shapes below are CONFIRMED from the backend dev, verbatim:
//
// employee: { role, tasks: { total, pending, inProgress, completed, overdue } }
// manager:  { role, department: { id, name }, employees: { total, active, inactive }, tasks: {...} }
// admin:    { role, employees: { total, active, inactive }, departments: { total, active, inactive }, tasks: {...} }

const MOCK_STATS_BY_ROLE = {
  admin: {
    // CONFIRMED shape — matches backend dev's example exactly
    role: "admin",
    employees: {
      total: 52,
      active: 49,
      inactive: 3,
    },
    departments: {
      total: 6,
      active: 6,
      inactive: 0,
    },
    tasks: {
      total: 128,
      pending: 35,
      inProgress: 41,
      completed: 52,
      overdue: 14,
    },
  },
  manager: {
    // CONFIRMED shape — matches backend dev's example exactly
    role: "manager",
    department: {
      id: "DEPARTMENT_ID",
      name: "Academic",
    },
    employees: {
      total: 18,
      active: 17,
      inactive: 1,
    },
    tasks: {
      total: 45,
      pending: 12,
      inProgress: 15,
      completed: 18,
      overdue: 6,
    },
  },
  employee: {
    // CONFIRMED shape — matches backend dev's example exactly
    role: "employee",
    tasks: {
      total: 12,
      pending: 4,
      inProgress: 3,
      completed: 5,
      overdue: 2,
    },
  },
};

/**
 * Simulates GET /api/dashboard/stats, scoped by role the same way the real
 * backend will scope it server-side.
 * @param {'admin'|'manager'|'employee'} role
 */
export const getMockDashboardStats = async (role = "employee") => {
  // artificial delay so loading states are actually visible during dev
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_STATS_BY_ROLE[role] ?? MOCK_STATS_BY_ROLE.employee;
};
