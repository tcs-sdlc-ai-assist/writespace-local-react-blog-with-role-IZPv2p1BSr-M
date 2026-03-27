import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, getHardCodedAdmin } from '../utils/session'
import { getUsers, saveUsers } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Avatar from '../components/Avatar'

function formatDate(dateString) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function UserManagement() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const hardCodedAdmin = getHardCodedAdmin()

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)

  const users = getUsers()

  const allUsers = [
    {
      id: hardCodedAdmin.id,
      username: hardCodedAdmin.username,
      displayName: hardCodedAdmin.displayName,
      role: hardCodedAdmin.role,
      createdAt: hardCodedAdmin.createdAt,
      isHardCoded: true,
    },
    ...users.map((u) => ({ ...u, isHardCoded: false })),
  ]

  function handleCreateUser(e) {
    e.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    const trimmedDisplayName = displayName.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername) {
      setError('Username is required.')
      return
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    if (trimmedUsername.length > 20) {
      setError('Username must be at most 20 characters.')
      return
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedUsername)) {
      setError('Username must be alphanumeric.')
      return
    }

    if (!trimmedDisplayName) {
      setError('Display name is required.')
      return
    }

    if (trimmedDisplayName.length > 32) {
      setError('Display name must be at most 32 characters.')
      return
    }

    if (!trimmedPassword) {
      setError('Password is required.')
      return
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (trimmedPassword.length > 32) {
      setError('Password must be at most 32 characters.')
      return
    }

    // Check uniqueness against hard-coded admin
    if (trimmedUsername.toLowerCase() === hardCodedAdmin.username.toLowerCase()) {
      setError('Username is already taken.')
      return
    }

    // Check uniqueness against existing users
    const currentUsers = getUsers()
    const exists = currentUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    )

    if (exists) {
      setError('Username is already taken.')
      return
    }

    const newUser = {
      id: 'user_' + Date.now(),
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...currentUsers, newUser])

    setUsername('')
    setDisplayName('')
    setPassword('')
    setRole('viewer')
    setError('')
    setShowForm(false)
    navigate('/users', { replace: true })
  }

  function handleDelete() {
    if (!deleteUserId) return

    const currentUsers = getUsers()
    const updatedUsers = currentUsers.filter((u) => u.id !== deleteUserId)
    saveUsers(updatedUsers)
    setDeleteUserId(null)
    navigate('/users', { replace: true })
  }

  function canDelete(user) {
    if (user.isHardCoded) return false
    if (currentUser && currentUser.id === user.id) return false
    return true
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage all users on the platform
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setError('')
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Create User'}
            </button>
          </div>

          {/* Create User Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create New User
              </h2>

              {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter display name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setError('')
                      setUsername('')
                      setDisplayName('')
                      setPassword('')
                      setRole('viewer')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users List */}
          {allUsers.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar role={user.role} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {user.role === 'admin' ? '👑 Admin' : '📖 Viewer'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        @{user.username} · Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {canDelete(user) ? (
                      <button
                        type="button"
                        onClick={() => setDeleteUserId(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete user"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    ) : (
                      <span className="p-2 text-gray-200">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-lg">
                No users found.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete User
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}