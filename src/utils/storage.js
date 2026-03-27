const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  SESSION: 'session',
}

export function getUsers() {
  try {
    const data = localStorage.getItem(KEYS.USERS)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read users from localStorage:', error)
    return []
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users to localStorage:', error)
  }
}

export function getPosts() {
  try {
    const data = localStorage.getItem(KEYS.POSTS)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to read posts from localStorage:', error)
    return []
  }
}

export function savePosts(posts) {
  try {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts))
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error)
  }
}

export function getSession() {
  try {
    const data = localStorage.getItem(KEYS.SESSION)
    if (!data) return null
    const parsed = JSON.parse(data)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch (error) {
    console.error('Failed to read session from localStorage:', error)
    return null
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session))
  } catch (error) {
    console.error('Failed to save session to localStorage:', error)
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION)
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error)
  }
}