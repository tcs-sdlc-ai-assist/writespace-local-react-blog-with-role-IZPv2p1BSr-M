import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import { getPosts, savePosts, getUsers } from '../utils/storage'
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

function truncate(text, maxLength = 80) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

function getAuthorInfo(authorId, users) {
  const author = users.find((u) => u.id === authorId)
  if (author) {
    return { name: author.displayName, role: author.role }
  }
  if (authorId === 'admin_default') {
    return { name: 'Admin', role: 'admin' }
  }
  return { name: 'Unknown', role: 'viewer' }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const admin = isAdmin()

  const [deletePostId, setDeletePostId] = useState(null)

  const posts = getPosts()
  const users = getUsers()

  const totalPosts = posts.length
  const totalUsers = users.length + 1 // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1
  const viewerCount = users.filter((u) => u.role === 'viewer').length

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  function handleDelete() {
    if (!deletePostId) return

    const currentPosts = getPosts()
    const updatedPosts = currentPosts.filter((p) => p.id !== deletePostId)
    savePosts(updatedPosts)
    setDeletePostId(null)
    navigate('/dashboard', { replace: true })
  }

  const stats = [
    {
      label: 'Total Posts',
      value: totalPosts,
      emoji: '📝',
      bgClass: 'bg-indigo-50',
      textClass: 'text-indigo-600',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      emoji: '👥',
      bgClass: 'bg-violet-50',
      textClass: 'text-violet-600',
    },
    {
      label: 'Admins',
      value: adminCount,
      emoji: '👑',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600',
    },
    {
      label: 'Viewers',
      value: viewerCount,
      emoji: '📖',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Overview of your WriteSpace platform
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${stat.bgClass} w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0`}
                  >
                    {stat.emoji}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p
                      className={`text-2xl font-bold ${stat.textClass}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/blogs/new"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create New Post
              </Link>
              <Link
                to="/users"
                className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Manage Users
              </Link>
              <Link
                to="/blogs"
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View All Posts
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Posts
            </h2>

            {recentPosts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
                {recentPosts.map((post) => {
                  const author = getAuthorInfo(post.authorId, users)
                  return (
                    <div
                      key={post.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar role={author.role} size="sm" />
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/blogs/${post.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            by {author.name} · {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/blogs/${post.id}/edit`}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                          aria-label="Edit post"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletePostId(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Delete post"
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
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your thoughts!
                </p>
                <Link
                  to="/blogs/new"
                  className="mt-4 inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create New Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {deletePostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Post
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletePostId(null)}
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