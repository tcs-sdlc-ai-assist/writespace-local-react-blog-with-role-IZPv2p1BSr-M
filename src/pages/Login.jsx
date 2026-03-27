import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'
import { getHardCodedAdmin } from '../utils/session'
import { getUsers, saveSession } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    const trimmedPassword = password.trim()

    if (!trimmedUsername) {
      setError('Username is required.')
      return
    }

    if (!trimmedPassword) {
      setError('Password is required.')
      return
    }

    // Check hard-coded admin first
    const admin = getHardCodedAdmin()
    if (trimmedUsername === admin.username && trimmedPassword === admin.password) {
      saveSession({
        userId: admin.id,
        role: admin.role,
        username: admin.username,
      })
      navigate('/dashboard', { replace: true })
      return
    }

    // Search localStorage users
    const users = getUsers()
    const found = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    )

    if (!found) {
      setError('Invalid username or password.')
      return
    }

    saveSession({
      userId: found.id,
      role: found.role,
      username: found.username,
    })

    if (found.role === 'admin') {
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/blogs', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your WriteSpace account
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

              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}