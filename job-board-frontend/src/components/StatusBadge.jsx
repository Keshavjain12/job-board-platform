import { getStatusMeta } from '../utils/jobTypes.js'

export default function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  return (
    <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${meta.color} ${meta.bg}`}>
      {meta.label}
    </span>
  )
}
