import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <p className="font-mono text-8xl text-border font-bold mb-4 select-none">404</p>
      <h1 className="font-display text-3xl text-text mb-3">Page not found</h1>
      <p className="text-muted text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link to="/" className="btn-primary">Back to job listings</Link>
    </div>
  )
}
