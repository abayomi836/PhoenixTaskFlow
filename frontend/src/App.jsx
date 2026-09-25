import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
return (
<BrowserRouter>
<Routes>
<Route element={<PublicLayout />}>
<Route path="/" element={<div>Home</div>} />
<Route path="/login" element={<div>Login</div>} />
<Route path="/register" element={<div>Register</div>} />
</Route>

<Route element={<ProtectedRoute />}>
<Route element={<DashboardLayout />}>
<Route path="/dashboard" element={<div>Dashboard</div>} />
<Route path="/tasks" element={<div>Tasks</div>} />
<Route path="/tasks/:id" element={<div>Task Details</div>} />
<Route path="/tasks/create" element={<div>Create Task</div>} />
<Route path="/tasks/:id/edit" element={<div>Edit Task</div>} />
<Route path="/employees" element={<div>Employees</div>} />
<Route path="/departments" element={<div>Departments</div>} />
<Route path="/profile" element={<div>Profile</div>} />
</Route>
</Route>
</Routes>
</BrowserRouter>
)
}

export default App
