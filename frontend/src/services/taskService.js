import api from './api'

const ALLOWED_STATUSES = ['pending', 'in-progress', 'completed']
const ALLOWED_PRIORITIES = ['low', 'medium', 'high']

export const getTaskAssignees = async () => {
  const response = await api.get('/users', {
    params: {
      limit: 100,
    },
  })

  const users = response.data.data.users || []

  return users
    .filter((user) => user.role === 'employee' && user.isActive)
    .map(({ _id, name, email, position, department }) => ({
      _id,
      name,
      email,
      position,
      department,
    }))
}

export const getTasks = async (filters = {}) => {
  const response = await api.get('/tasks', {
    params: {
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      department: filters.department || undefined,
      assignedTo: filters.assignedTo || undefined,
      search: filters.search?.trim() || undefined,
      page: filters.page || 1,
      limit: filters.limit || 10,
    },
  })

  const data = response.data.data

  return {
    tasks: data.tasks || [],
    pagination: data.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
  }
}

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`)

  return response.data.data
}

export const createTask = async (taskData) => {
  if (!taskData.title?.trim()) {
    throw new Error('A task title is required.')
  }

  if (!taskData.description?.trim()) {
    throw new Error('A task description is required.')
  }

  if (!ALLOWED_PRIORITIES.includes(taskData.priority)) {
    throw new Error('Choose a valid task priority.')
  }

  if (!taskData.assignedTo) {
    throw new Error('Choose an employee to assign this task to.')
  }

  if (!taskData.dueDate) {
    throw new Error('Enter a due date.')
  }

  const response = await api.post('/tasks', {
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    assignedTo:
      typeof taskData.assignedTo === 'string'
        ? taskData.assignedTo
        : taskData.assignedTo._id,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
  })

  return response.data.data
}

export const updateTask = async (taskId, taskData) => {
  const payload = {}

  if (taskData.title !== undefined) {
    payload.title = taskData.title.trim()
  }

  if (taskData.description !== undefined) {
    payload.description = taskData.description.trim()
  }

  if (taskData.assignedTo !== undefined) {
    payload.assignedTo =
      typeof taskData.assignedTo === 'string'
        ? taskData.assignedTo
        : taskData.assignedTo._id
  }

  if (taskData.priority !== undefined) {
    payload.priority = taskData.priority
  }

  if (taskData.dueDate !== undefined) {
    payload.dueDate = taskData.dueDate
  }

  const response = await api.patch(`/tasks/${taskId}`, payload)

  return response.data.data
}

export const updateTaskStatus = async (taskId, status) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error('Choose a valid task status.')
  }

  const response = await api.patch(`/tasks/${taskId}/status`, {
    status,
  })

  return response.data.data
}

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`)

  return true
}

export const isTaskOverdue = (
  task,
  now = new Date(),
) => {
  if (typeof task.overdue === 'boolean') {
    return task.overdue
  }

  return (
    task.status !== 'completed' &&
    new Date(task.dueDate) < now
  )
}