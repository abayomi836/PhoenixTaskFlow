const STORAGE_KEY = "phoenix-taskFlow.tasks.v1";

const ALLOWED_STATUSES = ["pending", "in-progress", "completed"];
const ALLOWED_PRIORITIES = ["low", "medium", "high"];

const mockDepartments = {
  academic: {
    _id: "mock-department-1",
    name: "Academic",
  },
  finance: {
    _id: "mock-department-2",
    name: "Finance",
  },
};

const mockEmployees = [
  {
    _id: "mock-user-1",
    name: "John Doe",
    email: "john@example.com",
    position: "Teacher",
    role: "employee",
    isActive: true,
    department: mockDepartments.academic,
  },
  {
    _id: "mock-user-2",
    name: "Alex Morgan",
    email: "alex@example.com",
    position: "Accountant",
    role: "employee",
    isActive: true,
    department: mockDepartments.finance,
  },
  {
    _id: "mock-user-3",
    name: "Sarah Williams",
    email: "sarah@example.com",
    position: "Teacher",
    role: "employee",
    isActive: true,
    department: mockDepartments.academic,
  },
  {
    _id: "mock-user-inactive",
    name: "Inactive Employee",
    email: "inactive@example.com",
    position: "Assistant",
    role: "employee",
    isActive: false,
    department: mockDepartments.academic,
  },
];

const mockManager = {
  _id: "mock-manager-1",
  name: "Jane Manager",
  email: "jane@example.com",
  position: "Head of Department",
  role: "manager",
  department: mockDepartments.academic,
};

const mockAdmin = {
  _id: "mock-admin-1",
  name: "Admin User",
  email: "admin@example.com",
  position: "Administrator",
  role: "admin",
};

const initialTasks = [
  {
    _id: "mock-task-1",
    title: "Prepare monthly report",
    description: "Prepare the September financial report.",
    assignedTo: mockEmployees[0],
    assignedBy: mockManager,
    department: mockDepartments.academic,
    priority: "high",
    status: "pending",
    dueDate: "2026-10-01T00:00:00.000Z",
    completedAt: null,
    createdAt: "2026-09-24T10:00:00.000Z",
    updatedAt: "2026-09-24T10:00:00.000Z",
  },
  {
    _id: "mock-task-2",
    title: "Review staff attendance",
    description: "Check and submit the weekly attendance records.",
    assignedTo: mockEmployees[0],
    assignedBy: mockManager,
    department: mockDepartments.academic,
    priority: "medium",
    status: "in-progress",
    dueDate: "2026-09-30T00:00:00.000Z",
    completedAt: null,
    createdAt: "2026-09-22T09:00:00.000Z",
    updatedAt: "2026-09-25T14:30:00.000Z",
  },
  {
    _id: "mock-task-3",
    title: "Archive last month's records",
    description: "Organize completed records in the department archive.",
    assignedTo: mockEmployees[1],
    assignedBy: mockManager,
    department: mockDepartments.finance,
    priority: "low",
    status: "completed",
    dueDate: "2026-09-20T00:00:00.000Z",
    completedAt: "2026-09-19T15:00:00.000Z",
    createdAt: "2026-09-15T08:00:00.000Z",
    updatedAt: "2026-09-19T15:00:00.000Z",
  },
  {
    _id: "mock-task-4",
    title: "Submit department expenses",
    description: "Collect and submit outstanding department expenses.",
    assignedTo: mockEmployees[1],
    assignedBy: mockManager,
    department: mockDepartments.finance,
    priority: "high",
    status: "pending",
    dueDate: "2026-09-24T00:00:00.000Z",
    completedAt: null,
    createdAt: "2026-09-18T11:00:00.000Z",
    updatedAt: "2026-09-18T11:00:00.000Z",
  },
  {
    _id: "mock-task-5",
    title: "Prepare student attendance summary",
    description: "Prepare the weekly student attendance summary.",
    assignedTo: mockEmployees[2],
    assignedBy: mockManager,
    department: mockDepartments.academic,
    priority: "medium",
    status: "pending",
    dueDate: "2026-10-03T00:00:00.000Z",
    completedAt: null,
    createdAt: "2026-09-25T08:00:00.000Z",
    updatedAt: "2026-09-25T08:00:00.000Z",
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const getId = (value) =>
  typeof value === "string" ? value : value?._id;

const readTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }
  } catch {
    // Reset to demo data if localStorage contains invalid data.
  }

  const tasks = clone(initialTasks);
  writeTasks(tasks);

  return tasks;
};

const writeTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const getEmployee = (assignedTo) => {
  const employeeId = getId(assignedTo);

  const employee = mockEmployees.find(
    (candidate) =>
      candidate._id === employeeId && candidate.isActive,
  );

  if (!employee) {
    throw new Error(
      "Choose an active employee to assign this task to.",
    );
  }

  return employee;
};

const validateTaskFields = (taskData) => {
  const title = taskData.title?.trim();
  const description = taskData.description?.trim();
  const priority = taskData.priority;
  const dueDate = taskData.dueDate;

  if (!title) {
    throw new Error("A task title is required.");
  }

  if (!description) {
    throw new Error("A task description is required.");
  }

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    throw new Error("Choose a valid task priority.");
  }

  if (!dueDate || Number.isNaN(new Date(dueDate).getTime())) {
    throw new Error("Enter a valid due date.");
  }

  const assignedTo = getEmployee(taskData.assignedTo);

  return {
    title,
    description,
    assignedTo,
    department: assignedTo.department,
    priority,
    dueDate: new Date(dueDate).toISOString(),
  };
};

export const getTaskAssignees = async () =>
  clone(
    mockEmployees
      .filter((employee) => employee.isActive)
      .map(({ _id, name, email, position, department }) => ({
        _id,
        name,
        email,
        position,
        department,
      })),
  );

export const getTasks = async (filters = {}) => {
  const tasks = readTasks();

  const search = filters.search?.trim().toLowerCase();

  let filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      !filters.status || task.status === filters.status;

    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    const matchesAssignee =
      !filters.assignedTo ||
      getId(task.assignedTo) === getId(filters.assignedTo);

    const matchesDepartment =
      !filters.department ||
      getId(task.department) === getId(filters.department);

    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search) ||
      task.assignedTo?.name?.toLowerCase().includes(search);

    return (
      matchesStatus &&
      matchesPriority &&
      matchesAssignee &&
      matchesDepartment &&
      matchesSearch
    );
  });

  filteredTasks.sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.max(1, Number(filters.limit) || 10);

  const total = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const startIndex = (page - 1) * limit;

  return {
    tasks: clone(
      filteredTasks.slice(startIndex, startIndex + limit),
    ),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getTaskById = async (taskId) => {
  const task = readTasks().find(
    (candidate) => candidate._id === taskId,
  );

  return task ? clone(task) : null;
};

export const createTask = async (taskData) => {
  const fields = validateTaskFields(taskData);

  const now = new Date().toISOString();

  const newTask = {
    ...fields,
    _id: `mock-task-${Date.now()}`,
    assignedBy: clone(mockManager),
    status: "pending",
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  writeTasks([newTask, ...readTasks()]);

  return clone(newTask);
};

export const updateTask = async (taskId, taskData) => {
  const tasks = readTasks();

  const taskIndex = tasks.findIndex(
    (task) => task._id === taskId,
  );

  if (taskIndex === -1) {
    return null;
  }

  const currentTask = tasks[taskIndex];

  const fields = validateTaskFields({
    ...currentTask,
    ...taskData,
  });

  const updatedTask = {
    ...currentTask,
    ...fields,
    updatedAt: new Date().toISOString(),
  };

  tasks[taskIndex] = updatedTask;

  writeTasks(tasks);

  return clone(updatedTask);
};

export const updateTaskStatus = async (taskId, status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error("Choose a valid task status.");
  }

  const tasks = readTasks();

  const taskIndex = tasks.findIndex(
    (task) => task._id === taskId,
  );

  if (taskIndex === -1) {
    return null;
  }

  const now = new Date().toISOString();

  const updatedTask = {
    ...tasks[taskIndex],
    status,
    completedAt:
      status === "completed" ? now : null,
    updatedAt: now,
  };

  tasks[taskIndex] = updatedTask;

  writeTasks(tasks);

  return clone(updatedTask);
};

export const deleteTask = async (taskId) => {
  const tasks = readTasks();

  const taskExists = tasks.some(
    (task) => task._id === taskId,
  );

  if (!taskExists) {
    return false;
  }

  writeTasks(
    tasks.filter((task) => task._id !== taskId),
  );

  return true;
};

export const isTaskOverdue = (
  task,
  now = new Date(),
) =>
  task.status !== "completed" &&
  new Date(task.dueDate) < now;

export const resetDemoTasks = () => {
  writeTasks(clone(initialTasks));
};

export const demoUsers = {
  admin: clone(mockAdmin),
  manager: clone(mockManager),
  employee: clone(mockEmployees[0]),
};