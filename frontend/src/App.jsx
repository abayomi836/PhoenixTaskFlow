import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import TasksPage from './pages/TasksPage'
import CreateTaskPage from './pages/CreateTaskPage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import EditTaskPage from './pages/EditTaskPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/tasks" replace />}
        />

        <Route
          path="/tasks"
          element={<TasksPage />}
        />

        <Route
          path="/tasks/create"
          element={<CreateTaskPage />}
        />

        <Route
          path="/tasks/:id"
          element={<TaskDetailsPage />}
        />

        <Route
          path="/tasks/:id/edit"
          element={<EditTaskPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/tasks" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App