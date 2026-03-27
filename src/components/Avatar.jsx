export default function Avatar({ role, size = 'md' }) {
  const isAdminRole = role === 'admin'
  const emoji = isAdminRole ? '👑' : '📖'
  const bgClass = isAdminRole ? 'bg-violet-100' : 'bg-indigo-100'

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
  }

  const classes = sizeClasses[size] || sizeClasses.md

  return (
    <div
      className={`${bgClass} ${classes} rounded-full flex items-center justify-center shrink-0`}
      role="img"
      aria-label={isAdminRole ? 'Admin avatar' : 'Viewer avatar'}
    >
      {emoji}
    </div>
  )
}