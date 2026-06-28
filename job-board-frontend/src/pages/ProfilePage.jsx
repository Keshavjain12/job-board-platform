import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyProfile, updateProfile } from '../api/jobs.js'
import Spinner from '../components/Spinner.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ bio: '', skills: '', resume_url: '', linkedin: '', github: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => {
        setForm({
          bio: data.bio ?? '',
          skills: data.skills ?? '',
          resume_url: data.resume_url ?? '',
          linkedin: data.linkedin ?? '',
          github: data.github ?? '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateProfile(form)
      setSaved(true)
    } catch {
      setError('Could not save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-mono text-muted mb-1">PROFILE</p>
        <h1 className="font-display text-3xl text-text">{user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username}</h1>
        <p className="text-muted text-sm mt-1">@{user.username} · {user.email}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-danger/10 text-danger border border-danger/30 text-sm rounded-lg px-4 py-3">{error}</div>
          )}
          {saved && (
            <div className="bg-teal/10 text-teal border border-teal/30 text-sm rounded-lg px-4 py-3">Profile saved.</div>
          )}

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea name="bio" rows={4} className="form-input resize-none" placeholder="Tell employers about yourself…" value={form.bio} onChange={set} />
          </div>

          <div className="form-group">
            <label className="form-label">Skills</label>
            <input name="skills" className="form-input" placeholder="e.g. Python, React, SQL, Django" value={form.skills} onChange={set} />
            <p className="text-muted text-xs mt-1">Comma-separated list of skills</p>
          </div>

          <div className="form-group">
            <label className="form-label">Resume URL</label>
            <input name="resume_url" type="url" className="form-input" placeholder="https://drive.google.com/…" value={form.resume_url} onChange={set} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input name="linkedin" type="url" className="form-input" placeholder="https://linkedin.com/in/…" value={form.linkedin} onChange={set} />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input name="github" type="url" className="form-input" placeholder="https://github.com/…" value={form.github} onChange={set} />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 self-start">
            {saving && <Spinner size="sm" />}
            Save profile
          </button>
        </form>
      </div>
    </div>
  )
}
