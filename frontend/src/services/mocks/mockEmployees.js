// mockEmployees.js
// Fake data standing in for GET/POST/PATCH /api/users until the real
// backend endpoints are confirmed/live.
//
// Per the original API contract doc: "Optional filtering/pagination can be
// added later" for GET /users — meaning pagination isn't implemented yet,
// so `data` is a plain array of employee objects, same as every other
// non-paginated endpoint in the contract. If the backend adds pagination
// later, this and employeeService.js's unwrapping logic need a small
// update together.
//
// Fields per contract §8 (User model): name, email, role, position,
// department, isActive. (password/passwordHash never returned to frontend.)
//
// This mock keeps an in-memory array so create/update/activate actions
// actually persist for the rest of your session (resets on page refresh) —
// close enough to real behavior to test the UI flow end to end.

let MOCK_EMPLOYEES = [
  {
    _id: "emp001",
    name: "Amaka Obi",
    email: "amaka.obi@phoenixtaskflow.com",
    role: "admin",
    position: "Head Administrator",
    department: { _id: "dept001", name: "Operations" },
    isActive: true,
  },
  {
    _id: "emp002",
    name: "Daniel Mensah",
    email: "daniel.mensah@phoenixtaskflow.com",
    role: "manager",
    position: "Academic Coordinator",
    department: { _id: "dept002", name: "Academic" },
    isActive: true,
  },
  {
    _id: "emp003",
    name: "Chidi Nwosu",
    email: "chidi.nwosu@phoenixtaskflow.com",
    role: "employee",
    position: "Teacher",
    department: { _id: "dept002", name: "Academic" },
    isActive: true,
  },
  {
    _id: "emp004",
    name: "Fatima Bello",
    email: "fatima.bello@phoenixtaskflow.com",
    role: "employee",
    position: "Accountant",
    department: { _id: "dept003", name: "Finance" },
    isActive: true,
  },
  {
    _id: "emp005",
    name: "Tunde Adeyemi",
    email: "tunde.adeyemi@phoenixtaskflow.com",
    role: "employee",
    position: "IT Support",
    department: { _id: "dept004", name: "Information Technology" },
    isActive: false,
  },
  {
    _id: "emp006",
    name: "Ngozi Eze",
    email: "ngozi.eze@phoenixtaskflow.com",
    role: "employee",
    position: "HR Officer",
    department: { _id: "dept005", name: "Human Resources" },
    isActive: true,
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates GET /api/users, optionally scoped to a department the same way
 * a manager's request would be scoped server-side.
 * @param {Object} params - { departmentId } (mock-only; real backend infers
 *   scope from JWT, doesn't take a departmentId param for this purpose)
 */
export const getMockEmployees = async (params = {}) => {
  await delay(400);
  if (params.departmentId) {
    return MOCK_EMPLOYEES.filter(
      (emp) => emp.department._id === params.departmentId
    );
  }
  return MOCK_EMPLOYEES;
};

export const getMockEmployeeById = async (id) => {
  await delay(300);
  const found = MOCK_EMPLOYEES.find((emp) => emp._id === id);
  if (!found) {
    const error = new Error("Employee not found");
    error.response = { status: 404, data: { message: "Employee not found" } };
    throw error;
  }
  return found;
};

/**
 * Simulates POST /api/users (admin only, per contract).
 * @param {Object} employeeData - { name, email, position, department, role }
 */
export const createMockEmployee = async (employeeData) => {
  await delay(500);
  if (!employeeData.name || !employeeData.email) {
    const error = new Error("Name and email are required");
    error.response = { status: 400, data: { message: "Name and email are required" } };
    throw error;
  }
  const duplicate = MOCK_EMPLOYEES.some(
    (emp) => emp.email.toLowerCase() === employeeData.email.toLowerCase()
  );
  if (duplicate) {
    const error = new Error("Email already in use");
    error.response = { status: 409, data: { message: "Email already in use" } };
    throw error;
  }
  const newEmployee = {
    _id: `emp${String(MOCK_EMPLOYEES.length + 1).padStart(3, "0")}`,
    name: employeeData.name,
    email: employeeData.email,
    role: employeeData.role || "employee",
    position: employeeData.position || "",
    department: employeeData.department || null,
    isActive: true,
  };
  MOCK_EMPLOYEES = [...MOCK_EMPLOYEES, newEmployee];
  return newEmployee;
};

/**
 * Simulates PATCH /api/users/:id
 */
export const updateMockEmployee = async (id, updates) => {
  await delay(400);
  const index = MOCK_EMPLOYEES.findIndex((emp) => emp._id === id);
  if (index === -1) {
    const error = new Error("Employee not found");
    error.response = { status: 404, data: { message: "Employee not found" } };
    throw error;
  }
  const updated = { ...MOCK_EMPLOYEES[index], ...updates };
  MOCK_EMPLOYEES = [
    ...MOCK_EMPLOYEES.slice(0, index),
    updated,
    ...MOCK_EMPLOYEES.slice(index + 1),
  ];
  return updated;
};
