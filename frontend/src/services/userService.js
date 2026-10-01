import api from './api'

export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get('/users', {
    params: {
      page,
      limit,
    },
  })

  return response.data.data
}

export const updateUser = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData)

  return response.data.data
}

export const createUser = async (userData) => {
  const response = await api.post('/users', userData)

  return response.data.data
}