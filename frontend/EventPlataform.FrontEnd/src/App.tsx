import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import CreateEvent from './pages/CreateEvent'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'

import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App