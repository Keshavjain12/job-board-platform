import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getJobs } from '../api/jobs.js'
import JobCard from '../components/JobCard.jsx'
import Spinner from '../components/Spinner.jsx'
import EmptyState from '../components/EmptyState.jsx'

const JOB_TYPES = [
  { value: '', label: 'All types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
]

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const search = searchParams.get('search') ?? ''
  const jobType = searchParams.get('job_type') ?? ''
  const location = searchParams.get('location') ?? ''

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (search) params.search = search
      if (jobType) params.job_type = jobType
      if (location) params.location = location
      const { data } = await getJobs(params)
      setJobs(Array.isArray(data) ? data : data.results ?? [])
    } catch {
      setError('Could not load jobs. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [search, jobType, location])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold text-text mb-2">
          Find your next role
        </h1>
        <p className="text-muted text-base">
          Browse open positions posted by verified employers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search jobs, companies…"
          className="form-input flex-1 text-sm"
          defaultValue={search}
          onChange={(e) => setParam('search', e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="form-input sm:w-44 text-sm"
          defaultValue={location}
          onChange={(e) => setParam('location', e.target.value)}
        />
        <select
          value={jobType}
          onChange={(e) => setParam('job_type', e.target.value)}
          className="form-input sm:w-44 text-sm"
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-danger text-sm text-center py-10">{error}</div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="🗂️"
          title="No jobs found"
          description="Try adjusting your search filters or check back later."
        />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-muted text-xs font-mono mb-1">{jobs.length} listing{jobs.length !== 1 ? 's' : ''}</p>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
