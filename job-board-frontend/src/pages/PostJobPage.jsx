import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createJob, updateJob, getJob } from '../api/jobs.js'
import Spinner from '../components/Spinner.jsx'

const EMPTY = {
  title: '',
  company_name: '',
  location: '',
  job_type: 'full_time',
  salary_min: '',
  salary_max: '',
  description: '',
  requirements: '',
  deadline: '',
}

export default function PostJobPage() {
  const { id } = useParams()  // if editing
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getJob(id)
      .then(({ data }) => {
        setForm({
          title: data.title ?? '',
          company_name: data.company_name ?? '',
          location: data.location ?? '',
          job_type: data.job_type ?? 'full_time',
          salary_min: data.salary_min ?? '',
          salary_max: data.salary_max ?? '',
          description: data.description ?? '',
          requirements: data.requirements ?? '',
          deadline: data.deadline ?? '',
        })
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false))
  }, [id, isEdit, navigate])

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateJob(id, form)
      } else {
        await createJob(form)
      }
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const first = Object.values(data)[0]
        setError(Array.isArray(first) ? first[0] : String(first))
      } else {
        setError('Could not save job. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-text mb-8">
        {isEdit ? 'Edit job listing' : 'Post a new job'}
      </h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-danger/10 text-danger border border-danger/30 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Job title *</label>
            <input name="title" className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={set} required />
          </div>

          <div className="form-group">
            <label className="form-label">Company name *</label>
            <input name="company_name" className="form-input" placeholder="Acme Corp" value={form.company_name} onChange={set} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input name="location" className="form-input" placeholder="New York, NY" value={form.location} onChange={set} />
            </div>
            <div className="form-group">
              <label className="form-label">Job type *</label>
              <select name="job_type" className="form-input" value={form.job_type} onChange={set} required>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Salary min ($)</label>
              <input name="salary_min" type="number" min="0" className="form-input" placeholder="50000" value={form.salary_min} onChange={set} />
            </div>
            <div className="form-group">
              <label className="form-label">Salary max ($)</label>
              <input name="salary_max" type="number" min="0" className="form-input" placeholder="90000" value={form.salary_max} onChange={set} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Application deadline</label>
            <input name="deadline" type="date" className="form-input" value={form.deadline} onChange={set} />
          </div>

          <div className="form-group">
            <label className="form-label">Job description *</label>
            <textarea name="description" rows={5} className="form-input resize-none" placeholder="Describe the role and responsibilities…" value={form.description} onChange={set} required />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea name="requirements" rows={4} className="form-input resize-none" placeholder="List required skills, experience, and qualifications…" value={form.requirements} onChange={set} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Spinner size="sm" />}
              {isEdit ? 'Save changes' : 'Publish listing'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
