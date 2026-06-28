import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getJob, applyToJob } from '../api/jobs.js'
import { useAuth } from '../context/AuthContext.jsx'
import { getJobTypeMeta } from '../utils/jobTypes.js'
import Spinner from '../components/Spinner.jsx'

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyOpen, setApplyOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getJob(id)
      .then(({ data }) => setJob(data))
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }
    setApplying(true)
    setError('')
    try {
      await applyToJob(id, { cover_letter: coverLetter })
      setApplied(true)
      setApplyOpen(false)
    } catch (err) {
      setError(err.response?.data?.detail ?? err.response?.data?.non_field_errors?.[0] ?? 'Could not submit application.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>
  }
  if (!job) return null

  const meta = getJobTypeMeta(job.job_type)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-muted hover:text-text transition-colors mb-6 inline-block">
        ← Back to listings
      </Link>

      <div className="card mb-6">
        {/* Title block */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="font-display text-3xl text-text leading-tight mb-1">{job.title}</h1>
            <p className="text-muted">{job.company_name}</p>
          </div>
          <span
            className="font-mono text-xs px-2.5 py-1.5 rounded shrink-0 mt-1"
            style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}40` }}
          >
            {meta.label}
          </span>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-3 text-sm font-mono text-muted border-t border-border pt-5 mb-5">
          {job.location && <span>📍 {job.location}</span>}
          {job.salary_min && job.salary_max && (
            <span>💰 ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}</span>
          )}
          <span>📅 Posted {new Date(job.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
          {job.deadline && <span>⏰ Deadline {new Date(job.deadline).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>}
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          <h2 className="font-display text-lg text-text mb-3">About the role</h2>
          <div className="text-muted text-sm whitespace-pre-wrap leading-relaxed">{job.description}</div>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mt-6">
            <h2 className="font-display text-lg text-text mb-3">Requirements</h2>
            <div className="text-muted text-sm whitespace-pre-wrap leading-relaxed">{job.requirements}</div>
          </div>
        )}

        {/* Apply section */}
        <div className="mt-8 pt-6 border-t border-border">
          {applied ? (
            <div className="bg-teal/10 text-teal border border-teal/30 rounded-lg px-5 py-4 text-sm font-medium">
              ✓ Application submitted! Check your dashboard to track its status.
            </div>
          ) : user?.role === 'job_seeker' || !user ? (
            <>
              {applyOpen ? (
                <div className="flex flex-col gap-3">
                  {error && (
                    <div className="bg-danger/10 text-danger border border-danger/30 text-sm rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}
                  <label className="form-label">Cover letter (optional)</label>
                  <textarea
                    rows={5}
                    className="form-input text-sm resize-none"
                    placeholder="Why are you a great fit for this role?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="btn-primary flex items-center gap-2"
                    >
                      {applying && <Spinner size="sm" />}
                      Submit application
                    </button>
                    <button onClick={() => setApplyOpen(false)} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setApplyOpen(true)} className="btn-primary">
                  {user ? 'Apply for this role' : 'Sign in to apply'}
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
