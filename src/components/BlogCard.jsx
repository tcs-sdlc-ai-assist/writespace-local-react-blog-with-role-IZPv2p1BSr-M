import { Link } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import Avatar from './Avatar'

const accentColors = [
  'border-indigo-500',
  'border-violet-500',
  'border-blue-500',
  'border-purple-500',
  'border-pink-500',
  'border-teal-500',
]

function truncate(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

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

export default function BlogCard({ post, index = 0, authorName, authorRole }) {
  const user = getCurrentUser()
  const admin = isAdmin()
  const accentClass = accentColors[index % accentColors.length]

  const canEdit =
    user && (admin || (user.role === 'viewer' && user.id === post.authorId))

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 ${accentClass} border border-gray-200 hover:shadow-md transition-shadow flex flex-col`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/blogs/${post.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-gray-600 flex-1">
          {truncate(post.body)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar role={authorRole || 'viewer'} size="sm" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {authorName || 'Unknown'}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {canEdit && (
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
          )}
        </div>
      </div>
    </div>
  )
}