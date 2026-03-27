import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import { clearSession } from '../utils/storage'
import Avatar from './Avatar'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()
  const admin = isAdmin()

  function handleLogout() {
    clearSession()
    setMenuOpen(false)
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ✍️ WriteSpace
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {admin && (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/blogs"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Blogs
                </Link>
                {admin && (
                  <Link
                    to="/users"
                    className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Users
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-2">
                  <Avatar role={user.role} size="sm" />
                  <span className="text-sm text-gray-700 font-medium">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Avatar role={user.role} size="sm" />
                  <span className="text-sm text-gray-700 font-medium">
                    {user.displayName}
                  </span>
                </div>
                {admin && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/blogs"
                  onClick={closeMenu}
                  className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Blogs
                </Link>
                {admin && (
                  <Link
                    to="/users"
                    onClick={closeMenu}
                    className="block text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Users
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block text-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}