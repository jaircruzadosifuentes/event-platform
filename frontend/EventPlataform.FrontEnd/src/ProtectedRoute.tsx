import { Navigate } from 'react-router-dom'
import authService from './services/authService'

interface ProtectedRouteProps {
  children: React.ReactElement
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const authenticated = authService.isAuthenticated()
  console.log(authenticated);
  
  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute