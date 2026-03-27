import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser, getHardCodedAdmin } from '../utils/session'
import { getUsers, saveUsers, saveSession } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      if (user.role === 'admin') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/blogs', { replace: true })
      }
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    const trimmedDisplayName = displayName.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

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

    if (!trimmedConfirmPassword) {
      setError('Please confirm your password.')
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Check uniqueness against hard-coded admin
    const admin = getHardCodedAdmin()
    if (trimmedUsername.toLowerCase() === admin.username.toLowerCase()) {
      setError('Username is already taken.')
      return
    }

    // Check uniqueness against existing users
    const users = getUsers()
    const exists = users.find(
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
      role: 'viewer',
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])

    saveSession({
      userId: newUser.id,
      role: newUser.role,
      username: newUser.username,
    })

    navigate('/blogs', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-2 text-sm text-gray-600">
                Join WriteSpace and start sharing your ideas
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your display name"
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
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}