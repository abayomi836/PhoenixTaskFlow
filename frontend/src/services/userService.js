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