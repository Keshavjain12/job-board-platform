import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Spinner from '../components/Spinner.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    role: 'seeker',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const first = Object.values(data)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-text mb-1">Create an account</h1>
          <p className="text-muted text-sm">Join BoardHire today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-danger/10 text-danger border border-danger/30 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="flex gap-2">
                {['seeker', 'employer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.role === r
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-border text-muted bg-surface-light hover:border-muted'
                    }`}
                  >
                    {r === 'seeker' ? 'Job Seeker' : 'Employer'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">First name</label>
                <input id="first_name" name="first_name" className="form-input" value={form.first_name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">Last name</label>
                <input id="last_name" name="last_name" className="form-input" value={form.last_name} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input id="username" name="username" autoComplete="username" className="form-input" placeholder="choose_a_username" value={form.username} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password2" className="form-label">Confirm password</label>
              <input id="password2" name="password2" type="password" autoComplete="new-password" className="form-input" placeholder="••••••••" value={form.password2} onChange={handleChange} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
