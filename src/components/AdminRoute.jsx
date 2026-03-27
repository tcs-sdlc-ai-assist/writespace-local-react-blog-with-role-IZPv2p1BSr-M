import { Navigate, Outlet } from 'react-router-dom'
import { isAdmin } from '../utils/session'

export default function AdminRoute({ children }) {
  const admin = isAdmin()

  if (!admin) {
    return <Navigate to="/blogs" replace />
  }

  return children ? children : <Outlet />
}