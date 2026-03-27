import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children ? children : <Outlet />
}