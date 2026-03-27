import { getSession, getUsers } from './storage'

const HARD_CODED_ADMIN = {
  id: 'admin_default',
  username: 'admin',
  password: 'admin123',
  displayName: 'Admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
}

export function getCurrentUser() {
  try {
    const session = getSession()
    if (!session || !session.userId) return null

    if (session.userId === HARD_CODED_ADMIN.id) {
      const { password, ...user } = HARD_CODED_ADMIN
      return user
    }

    const users = getUsers()
    const user = users.find((u) => u.id === session.userId)
    return user || null
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

export function isAdmin() {
  const user = getCurrentUser()
  return user !== null && user.role === 'admin'
}

export function isViewer() {
  const user = getCurrentUser()
  return user !== null && user.role === 'viewer'
}

export function getHardCodedAdmin() {
  return { ...HARD_CODED_ADMIN }
}