import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
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
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
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

export default function BlogDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const user = getCurrentUser()
  const admin = isAdmin()

  const posts = getPosts()
  const users = getUsers()
  const post = posts.find((p) => p.id === id)

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Post Not Found
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="mt-6 inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  const author = getAuthorInfo(post.authorId, users)

  const canEdit =
    user && (admin || (user.role === 'viewer' && user.id === post.authorId))

  function handleDelete() {
    const currentPosts = getPosts()
    const currentPost = currentPosts.find((p) => p.id === id)

    if (!currentPost) {
      navigate('/blogs', { replace: true })
      return
    }

    const canDelete =
      user && (admin || (user.role === 'viewer' && user.id === currentPost.authorId))

    if (!canDelete) {
      setShowDeleteConfirm(false)
      return
    }

    const updatedPosts = currentPosts.filter((p) => p.id !== id)
    savePosts(updatedPosts)
    navigate('/blogs', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <Avatar role={author.role} size="md" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {author.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span> · Updated {formatDate(post.updatedAt)}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>

            {canEdit && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3">
                <Link
                  to={`/blogs/${post.id}/edit`}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Post
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
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
                onClick={() => setShowDeleteConfirm(false)}
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