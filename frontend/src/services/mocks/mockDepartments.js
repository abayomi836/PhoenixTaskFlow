// mockDepartments.js
// Fake data standing in for GET/POST/PATCH/DELETE /api/departments until
// the real backend endpoints are confirmed/live.
//
// Fields per contract §8 (Department model): name, description, isActive.
// These 5 IDs match the ones already referenced in mockEmployees.js — keep
// both files in sync if department data changes.
//
// Keeps an in-memory array so create/edit/deactivate actually persist for
// the rest of your session (resets on page refresh).

let MOCK_DEPARTMENTS = [
  {
    _id: "dept001",
    name: "Operations",
    description: "Handles day-to-day organizational operations",
    isActive: true,
  },
  {
    _id: "dept002",
    name: "Academic",
    description: "Oversees teaching staff and academic programs",
    isActive: true,
  },
  {
    _id: "dept003",
    name: "Finance",
    description: "Handles financial operations",
    isActive: true,
  },
  {
    _id: "dept004",
    name: "Information Technology",
    description: "Manages systems, infrastructure and IT support",
    isActive: true,
  },
  {
    _id: "dept005",
    name: "Human Resources",
    description: "Manages staffing, hiring and employee welfare",
    isActive: true,
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMockDepartments = async () => {
  await delay(350);
  return MOCK_DEPARTMENTS;
};

export const getMockDepartmentById = async (id) => {
  await delay(250);
  const found = MOCK_DEPARTMENTS.find((d) => d._id === id);
  if (!found) {
    const error = new Error("Department not found");
    error.response = { status: 404, data: { message: "Department not found" } };
    throw error;
  }
  return found;
};

export const createMockDepartment = async (departmentData) => {
  await delay(450);
  if (!departmentData.name?.trim()) {
    const error = new Error("Department name is required");
    error.response = { status: 400, data: { message: "Department name is required" } };
    throw error;
  }
  const duplicate = MOCK_DEPARTMENTS.some(
    (d) => d.name.toLowerCase() === departmentData.name.trim().toLowerCase()
  );
  if (duplicate) {
    const error = new Error("A department with this name already exists");
    error.response = {
      status: 409,
      data: { message: "A department with this name already exists" },
    };
    throw error;
  }
  const newDept = {
    _id: `dept${String(MOCK_DEPARTMENTS.length + 1).padStart(3, "0")}`,
    name: departmentData.name.trim(),
    description: departmentData.description?.trim() || "",
    isActive: true,
  };
  MOCK_DEPARTMENTS = [...MOCK_DEPARTMENTS, newDept];
  return newDept;
};

export const updateMockDepartment = async (id, updates) => {
  await delay(400);
  const index = MOCK_DEPARTMENTS.findIndex((d) => d._id === id);
  if (index === -1) {
    const error = new Error("Department not found");
    error.response = { status: 404, data: { message: "Department not found" } };
    throw error;
  }
  const updated = { ...MOCK_DEPARTMENTS[index], ...updates };
  MOCK_DEPARTMENTS = [
    ...MOCK_DEPARTMENTS.slice(0, index),
    updated,
    ...MOCK_DEPARTMENTS.slice(index + 1),
  ];
  return updated;
};

export const deactivateMockDepartment = async (id) => {
  return updateMockDepartment(id, { isActive: false });
};
