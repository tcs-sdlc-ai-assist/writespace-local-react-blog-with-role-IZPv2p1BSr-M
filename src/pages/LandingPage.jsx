import { Link } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import { getPosts, getUsers } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'

const features = [
  {
    emoji: '✍️',
    title: 'Write & Share',
    description:
      'Create beautiful blog posts and share your thoughts with the world. Express yourself freely on WriteSpace.',
  },
  {
    emoji: '🔒',
    title: 'Role-Based Access',
    description:
      'Admins manage everything while viewers create and manage their own content. Secure and organized.',
  },
  {
    emoji: '⚡',
    title: 'Fast & Simple',
    description:
      'No complicated setup needed. Start writing immediately with our clean, intuitive interface.',
  },
]

export default function LandingPage() {
  const user = getCurrentUser()
  const admin = isAdmin()

  const posts = getPosts()
  const users = getUsers()

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  function getAuthorInfo(authorId) {
    const author = users.find((u) => u.id === authorId)
    if (author) {
      return { name: author.displayName, role: author.role }
    }
    if (authorId === 'admin_default') {
      return { name: 'Admin', role: 'admin' }
    }
    return { name: 'Unknown', role: 'viewer' }
  }

  const ctaLink = user ? (admin ? '/dashboard' : '/blogs') : '/register'
  const ctaLabel = user ? (admin ? 'Go to Dashboard' : 'View Blogs') : 'Get Started'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Welcome to{' '}
              <span className="text-indigo-600">✍️ WriteSpace</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              A simple, elegant blogging platform where you can share your ideas
              with the world. Start writing today.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Link
                to={ctaLink}
                className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {ctaLabel}
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="px-6 py-3 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Why WriteSpace?
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-xl mx-auto">
            Everything you need to start blogging, all in one place.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Latest Posts
            </h2>
            <p className="mt-2 text-gray-600 text-center max-w-xl mx-auto">
              Check out what our community has been writing about.
            </p>

            {latestPosts.length > 0 ? (
              <>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestPosts.map((post, index) => {
                    const author = getAuthorInfo(post.authorId)
                    return (
                      <BlogCard
                        key={post.id}
                        post={post}
                        index={index}
                        authorName={author.name}
                        authorRole={author.role}
                      />
                    )
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Link
                    to="/blogs"
                    className="px-6 py-3 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    View All Posts
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-10 text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your thoughts!
                </p>
                {!user && (
                  <Link
                    to="/register"
                    className="mt-4 inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}