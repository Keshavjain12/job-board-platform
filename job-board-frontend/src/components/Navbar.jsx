import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const active = (path) =>
    location.pathname === path ? 'text-accent' : 'text-muted hover:text-text'

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Wordmark */}
        <Link to="/" className="font-display text-xl font-semibold text-text mr-2">
          Board<span className="text-accent">Hire</span>
        </Link>

        {/* Left links */}
        <Link to="/" className={`text-sm font-medium transition-colors ${active('/')}`}>
          Jobs
        </Link>

        <div className="flex-1" />

        {/* Right links */}
        {user ? (
          <>
            {user.role === 'employer' && (
              <Link
                to="/post-job"
                className="text-sm font-medium text-muted hover:text-text transition-colors"
              >
                Post a Job
              </Link>
            )}
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${active('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`text-sm font-medium transition-colors ${active('/profile')}`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-muted hover:text-danger transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-muted hover:text-text transition-colors"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
