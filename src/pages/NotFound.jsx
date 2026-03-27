import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-6xl font-bold text-indigo-600">404</p>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
            Page Not Found
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/"
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              to="/blogs"
              className="px-6 py-3 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              View Blogs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}