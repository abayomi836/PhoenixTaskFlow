import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
const isAuthenticated = false

if (!isAuthenticated) {
return <Navigate to="/login" replace />
}

return <Outlet />
}

export default ProtectedRoute