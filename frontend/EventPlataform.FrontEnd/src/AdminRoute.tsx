import { Navigate } from 'react-router-dom'
import authService from './services/authService'

interface AdminRouteProps {
  children: React.ReactElement
}

function AdminRoute({
  children,
}: AdminRouteProps) {
  const role = authService.getRole()

  if (role !== 'Admin') {
    return (
      <Navigate
        to="/events"
        replace
      />
    )
  }

  return children
}

export default AdminRoute