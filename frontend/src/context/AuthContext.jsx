import { createContext, useEffect, useState } from 'react'
import {
loginUser,
registerUser,
getCurrentUser,
} from '../services/authService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [token, setToken] = useState(localStorage.getItem('token'))
const [loading, setLoading] = useState(true)

const login = async (credentials) => {
const response = await loginUser(credentials)

const { user, token } = response.data

localStorage.setItem('token', token)
setToken(token)
setUser(user)

return response
}

const register = async (userData) => {
return await registerUser(userData)
}

const loadCurrentUser = async () => {
if (!token) {
setLoading(false)
return
}

try {
const response = await getCurrentUser(token)
setUser(response.data.user)
} catch (error) {
localStorage.removeItem('token')
setToken(null)
setUser(null)
} finally {
setLoading(false)
}
}

const logout = () => {
localStorage.removeItem('token')
setToken(null)
setUser(null)
}

useEffect(() => {
loadCurrentUser()
}, [])

return (
<AuthContext.Provider
value={{
user,
token,
loading,
login,
register,
loadCurrentUser,
logout,
}}
>
{children}
</AuthContext.Provider>
)
}
