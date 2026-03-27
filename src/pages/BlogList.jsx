import { Link } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../utils/session'
import { getPosts, getUsers } from '../utils/storage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'

export default function BlogList() {
  const user = getCurrentUser()
  const admin = isAdmin()

  const posts = getPosts()
  const users = getUsers()

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Blog Posts
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse all posts from our community
              </p>
            </div>
            <Link
              to="/blogs/new"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create New Post
            </Link>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post, index) => {
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
          ) : (
            <div className="text-center py-16">
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
      </main>

      <Footer />
    </div>
  )
}