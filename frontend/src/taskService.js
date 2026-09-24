import api from './api'

const TASKS_ENDPOINT = '/api/tasks'

const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed']

let mockTasks = [
  {
    _id: 'mock-task-1',
    title: 'Prepare monthly report',
    description: 'Prepare the September financial report',
    assignedTo: {
      _id: 'mock-user-1',
      name: 'John Doe',
      email: 'john@example.com',
      position: 'Teacher',
    },
    assignedBy: {
      _id: 'mock-manager-1',
      name: 'Jane Manager',
      email: 'jane@example.com',
      position: 'Manager',
    },
    department: {
      _id: 'mock-department-1',
      name: 'Academic',
    },
    priority: 'high',
    status: 'pending',
    dueDate: '2026-10-01T00:00:00.000Z',
    completedAt: null,
    createdAt: '2026-09-24T10:00:00.000Z',
    updatedAt: '2026-09-24T10:00:00.000Z',
  },
]

const isBackendUnavailable = (error) => !error.response

const requestWithMockFallback = async (request, fallback) => {
  try {
    const response = await request()
    return response.data.data
  } catch (error) {
    // Mock data is used only when the backend cannot be reached.
    // Authorization and validation errors are still returned to the UI.
    if (isBackendUnavailable(error)) {
      return fallback()
    }

    throw error
  }
}

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined,
    ),
  )

const getTasksFromMock = (params = {}) => {
  const filters = cleanParams(params)
  let filteredTasks = [...mockTasks]

  if (filters.status) {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === filters.status,
    )
  }

  if (filters.priority) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === filters.priority,
    )
  }

  if (filters.assignedTo) {
    filteredTasks = filteredTasks.filter(
      (task) => task.assignedTo._id === filters.assignedTo,
    )
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()

    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm),
    )
  }

  const page = Number(filters.page) || 1
  const limit = Number(filters.limit) || 10
  const total = filteredTasks.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startIndex = (page - 1) * limit

  return {
    tasks: filteredTasks.slice(startIndex, startIndex + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

const validateStatus = (status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error(`Invalid task status: ${status}`)
  }
}

export const getTasks = async (filters = {}) =>
  requestWithMockFallback(
    () => api.get(TASKS_ENDPOINT, { params: cleanParams(filters) }),
    () => getTasksFromMock(filters),
  )

export const getTaskById = async (taskId) =>
  requestWithMockFallback(
    () => api.get(`${TASKS_ENDPOINT}/${taskId}`),
    () => mockTasks.find((task) => task._id === taskId) || null,
  )

export const createTask = async (taskData) =>
  requestWithMockFallback(
    () => api.post(TASKS_ENDPOINT, taskData),
    () => {
      const now = new Date().toISOString()

      const newTask = {
        ...taskData,
        _id: `mock-task-${Date.now()}`,
        assignedBy: {
          _id: 'mock-manager-1',
          name: 'Jane Manager',
          email: 'jane@example.com',
          position: 'Manager',
        },
        department: {
          _id: 'mock-department-1',
          name: 'Academic',
        },
        status: 'pending',
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      }

      mockTasks = [newTask, ...mockTasks]

      return newTask
    },
  )

export const updateTask = async (taskId, taskData) =>
  requestWithMockFallback(
    () => api.patch(`${TASKS_ENDPOINT}/${taskId}`, taskData),
    () => {
      const taskIndex = mockTasks.findIndex((task) => task._id === taskId)

      if (taskIndex === -1) {
        return null
      }

      const updatedTask = {
        ...mockTasks[taskIndex],
        ...taskData,
        updatedAt: new Date().toISOString(),
      }

      mockTasks[taskIndex] = updatedTask

      return updatedTask
    },
  )

export const updateTaskStatus = async (taskId, status) => {
  validateStatus(status)

  return requestWithMockFallback(
    () => api.patch(`${TASKS_ENDPOINT}/${taskId}/status`, { status }),
    () => {
      const taskIndex = mockTasks.findIndex((task) => task._id === taskId)

      if (taskIndex === -1) {
        return null
      }

      const updatedTask = {
        ...mockTasks[taskIndex],
        status,
        completedAt:
          status === 'completed' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      }

      mockTasks[taskIndex] = updatedTask

      return updatedTask
    },
  )
}

export const deleteTask = async (taskId) =>
  requestWithMockFallback(
    () => api.delete(`${TASKS_ENDPOINT}/${taskId}`),
    () => {
      mockTasks = mockTasks.filter((task) => task._id !== taskId)
      return null
    },
  ) 