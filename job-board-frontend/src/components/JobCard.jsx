import { Link } from 'react-router-dom'
import { getJobTypeMeta } from '../utils/jobTypes.js'

export default function JobCard({ job }) {
  const meta = getJobTypeMeta(job.job_type)

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block relative bg-surface rounded-xl border border-border overflow-hidden
                 hover:border-accent/50 hover:bg-surface-light transition-all group"
    >
      {/* Left accent stripe, colored by job type */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: meta.color }}
      />

      <div className="pl-5 pr-4 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-display text-lg text-text group-hover:text-accent transition-colors leading-snug">
              {job.title}
            </h3>
            <p className="text-sm text-muted mt-0.5">{job.company_name}</p>
          </div>

          {/* Ticket-stub type stamp */}
          <span
            className="font-mono text-[10px] font-medium px-2 py-1 rounded shrink-0 mt-0.5"
            style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}40` }}
          >
            {meta.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs font-mono text-muted">
          {job.location && (
            <span className="flex items-center gap-1">
              <span className="text-border">▸</span> {job.location}
            </span>
          )}
          {job.salary_min && job.salary_max && (
            <span className="flex items-center gap-1">
              <span className="text-border">▸</span>{' '}
              ${Number(job.salary_min).toLocaleString()} – ${Number(job.salary_max).toLocaleString()}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <span className="text-border">▸</span>{' '}
            {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  )
}
