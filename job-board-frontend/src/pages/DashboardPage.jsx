import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyApplications, getJobs, deleteJob, updateApplicationStatus, getJobApplications } from '../api/jobs.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getJobTypeMeta } from '../utils/jobTypes.js'

// ─── Seeker view ─────────────────────────────────────────────────────────────
function SeekerDashboard() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApps(Array.isArray(data) ? data : data.results ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-text">My applications</h2>
        <Link to="/" className="btn-secondary text-sm py-2">Browse jobs</Link>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          icon="📬"
          title="No applications yet"
          description="Find a role you love and hit Apply."
          action={<Link to="/" className="btn-primary mt-2">Browse jobs</Link>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => {
            const meta = getJobTypeMeta(app.job_detail?.job_type)
            return (
              <div key={app.id} className="card flex items-start gap-4">
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg text-text leading-snug">
                        {app.job_detail?.title ?? `Job #${app.job}`}
                      </h3>
                      <p className="text-sm text-muted">{app.job_detail?.company_name}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs font-mono text-muted mt-3">
                    Applied {new Date(app.applied_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </p>
                  {app.cover_letter && (
                    <p className="text-xs text-muted mt-2 line-clamp-2 italic">"{app.cover_letter}"</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Employer view ────────────────────────────────────────────────────────────
function EmployerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState(null)
  const [jobApps, setJobApps] = useState({})
  const [loadingApps, setLoadingApps] = useState({})

  useEffect(() => {
    // Fetch only this employer's jobs
    getJobs({ posted_by: user.id })
      .then(({ data }) => setJobs(Array.isArray(data) ? data : data.results ?? []))
      .finally(() => setLoading(false))
  }, [user.id])

  const toggleExpand = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return }
    setExpandedJob(jobId)
    if (!jobApps[jobId]) {
      setLoadingApps((s) => ({ ...s, [jobId]: true }))
      try {
        const { data } = await getJobApplications(jobId)
        setJobApps((s) => ({ ...s, [jobId]: Array.isArray(data) ? data : data.results ?? [] }))
      } finally {
        setLoadingApps((s) => ({ ...s, [jobId]: false }))
      }
    }
  }

  const handleStatusChange = async (appId, status, jobId) => {
    await updateApplicationStatus(appId, status)
    setJobApps((s) => ({
      ...s,
      [jobId]: s[jobId].map((a) => (a.id === appId ? { ...a, status } : a)),
    }))
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this listing?')) return
    await deleteJob(jobId)
    setJobs((s) => s.filter((j) => j.id !== jobId))
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-text">Your listings</h2>
        <Link to="/post-job" className="btn-primary text-sm py-2">+ Post a job</Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No listings yet"
          description="Post your first job to start receiving applications."
          action={<Link to="/post-job" className="btn-primary mt-2">Post a job</Link>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => {
            const meta = getJobTypeMeta(job.job_type)
            const isExpanded = expandedJob === job.id
            const apps = jobApps[job.id] ?? []

            return (
              <div key={job.id} className="card">
                <div className="flex items-start gap-3">
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg text-text">{job.title}</h3>
                        <p className="text-sm text-muted">{job.company_name} · {job.location}</p>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-1 rounded shrink-0"
                        style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}40` }}>
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4 flex-wrap">
                      <button onClick={() => toggleExpand(job.id)} className="btn-secondary text-xs py-1.5 px-3">
                        {isExpanded ? 'Hide' : 'View'} applicants
                      </button>
                      <button onClick={() => navigate(`/post-job/${job.id}`)} className="btn-secondary text-xs py-1.5 px-3">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="text-xs py-1.5 px-3 text-danger border border-danger/30 rounded-lg hover:bg-danger/10 transition-colors">
                        Delete
                      </button>
                    </div>

                    {/* Applicants */}
                    {isExpanded && (
                      <div className="mt-5 border-t border-border pt-5">
                        {loadingApps[job.id] ? (
                          <Spinner size="sm" />
                        ) : apps.length === 0 ? (
                          <p className="text-muted text-sm">No applications yet.</p>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {apps.map((app) => (
                              <div key={app.id} className="flex items-center justify-between gap-3 bg-surface-light rounded-lg px-4 py-3">
                                <div>
                                  <p className="text-sm text-text font-medium">{app.applicant_name ?? `Applicant #${app.applicant}`}</p>
                                  <p className="text-xs text-muted font-mono">
                                    {new Date(app.applied_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                                  </p>
                                </div>
                                <select
                                  value={app.status}
                                  onChange={(e) => handleStatusChange(app.id, e.target.value, job.id)}
                                  className="text-xs py-1 px-2"
                                >
                                  {['pending', 'reviewed', 'accepted', 'rejected'].map((s) => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-mono text-muted mb-1">
          {user.role === 'employer' ? 'EMPLOYER' : 'JOB SEEKER'}
        </p>
        <h1 className="font-display text-3xl text-text">
          Hey, {user.first_name || user.username}
        </h1>
      </div>
      {user.role === 'employer' ? <EmployerDashboard /> : <SeekerDashboard />}
    </div>
  )
}
