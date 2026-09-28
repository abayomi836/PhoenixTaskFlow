import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import TasksPage from './pages/TasksPage'
import CreateTaskPage from './pages/CreateTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import EditTaskPage from './pages/EditTaskPage'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected application routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/dashboard"
                element={<div>Dashboard</div>}
              />

              {/* Task Management */}
              <Route
                path="/tasks"
                element={<TasksPage />}
              />

              <Route
                path="/tasks/create"
                element={<CreateTaskPage />}
              />

              <Route
                path="/tasks/:id/edit"
                element={<EditTaskPage />}
              />

              <Route
                path="/tasks/:id"
                element={<TaskDetailsPage />}
              />

              {/* Other application sections */}
              <Route
                path="/employees"
                element={<div>Employees</div>}
              />

              <Route
                path="/departments"
                element={<div>Departments</div>}
              />

              <Route
                path="/profile"
                element={<div>Profile</div>}
              />

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App