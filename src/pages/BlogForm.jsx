import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import { getPosts, savePosts } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function BlogForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const user = getCurrentUser()
  const admin = isAdmin()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    if (isEdit) {
      const posts = getPosts()
      const post = posts.find((p) => p.id === id)

      if (!post) {
        navigate('/blogs', { replace: true })
        return
      }

      const canEdit =
        admin || (user.role === 'viewer' && user.id === post.authorId)

      if (!canEdit) {
        navigate('/blogs', { replace: true })
        return
      }

      setTitle(post.title || '')
      setExcerpt(post.excerpt || '')
      setBody(post.body || '')
    }
  }, [id, isEdit, user, admin, navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedTitle = title.trim()
    const trimmedExcerpt = excerpt.trim()
    const trimmedBody = body.trim()

    if (!trimmedTitle) {
      setError('Title is required.')
      return
    }

    if (trimmedTitle.length > 100) {
      setError('Title must be at most 100 characters.')
      return
    }

    if (trimmedExcerpt.length > 200) {
      setError('Excerpt must be at most 200 characters.')
      return
    }

    if (!trimmedBody) {
      setError('Content is required.')
      return
    }

    if (trimmedBody.length > 5000) {
      setError('Content must be at most 5000 characters.')
      return
    }

    const posts = getPosts()

    if (isEdit) {
      const postIndex = posts.findIndex((p) => p.id === id)

      if (postIndex === -1) {
        setError('Post not found.')
        return
      }

      const post = posts[postIndex]
      const canEdit =
        admin || (user.role === 'viewer' && user.id === post.authorId)

      if (!canEdit) {
        setError('You do not have permission to edit this post.')
        return
      }

      posts[postIndex] = {
        ...post,
        title: trimmedTitle,
        excerpt: trimmedExcerpt,
        body: trimmedBody,
        updatedAt: new Date().toISOString(),
      }

      savePosts(posts)
    } else {
      const newPost = {
        id: 'post_' + Date.now(),
        title: trimmedTitle,
        excerpt: trimmedExcerpt,
        body: trimmedBody,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      savePosts([...posts, newPost])
    }

    navigate('/blogs', { replace: true })
  }

  function handleDelete() {
    const posts = getPosts()
    const post = posts.find((p) => p.id === id)

    if (!post) {
      navigate('/blogs', { replace: true })
      return
    }

    const canDelete =
      admin || (user.role === 'viewer' && user.id === post.authorId)

    if (!canDelete) {
      setError('You do not have permission to delete this post.')
      setShowDeleteConfirm(false)
      return
    }

    const updatedPosts = posts.filter((p) => p.id !== id)
    savePosts(updatedPosts)
    navigate('/blogs', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isEdit
                  ? 'Update your blog post below'
                  : 'Share your thoughts with the world'}
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
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter post title"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {title.trim().length}/100 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt
                </label>
                <input
                  id="excerpt"
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Brief summary of your post (optional)"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {excerpt.trim().length}/200 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                  placeholder="Write your blog post content here..."
                />
                <p className="mt-1 text-xs text-gray-400">
                  {body.trim().length}/5000 characters
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {isEdit ? 'Update Post' : 'Publish Post'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/blogs')}
                    className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {isEdit && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
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