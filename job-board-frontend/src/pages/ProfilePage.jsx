import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getMyProfile, createProfile, updateProfile } from '../api/jobs.js'
import Spinner from '../components/Spinner.jsx'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profileId, setProfileId] = useState(null)
  const [form, setForm] = useState({ headline: '', bio: '', skills: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results ?? []
        const mine = list[0]
        if (mine) {
          setProfileId(mine.id)
          setForm({
            headline: mine.headline ?? '',
            bio: mine.bio ?? '',
            skills: mine.skills ?? '',
          })
        }
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
      if (profileId) {
        await updateProfile(profileId, form)
      } else {
        const { data } = await createProfile(form)
        setProfileId(data.id)
      }
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
            <label className="form-label">Headline</label>
            <input name="headline" className="form-input" placeholder="e.g. Backend Developer" value={form.headline} onChange={set} />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea name="bio" rows={4} className="form-input resize-none" placeholder="Tell employers about yourself…" value={form.bio} onChange={set} />
          </div>

          <div className="form-group">
            <label className="form-label">Skills</label>
            <input name="skills" className="form-input" placeholder="e.g. Python, React, SQL, Django" value={form.skills} onChange={set} />
            <p className="text-muted text-xs mt-1">Comma-separated list of skills</p>
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
