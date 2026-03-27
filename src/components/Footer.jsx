import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ✍️ WriteSpace
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/blogs"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Register
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {currentYear} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}