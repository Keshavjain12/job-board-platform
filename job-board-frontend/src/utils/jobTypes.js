export const JOB_TYPE_META = {
  full_time:  { label: 'FULL-TIME',  color: '#F5A623', bg: '#2A2010' },
  part_time:  { label: 'PART-TIME',  color: '#4FD1C5', bg: '#0F2423' },
  contract:   { label: 'CONTRACT',   color: '#9381FF', bg: '#1A1630' },
  internship: { label: 'INTERNSHIP', color: '#F472B6', bg: '#2A1020' },
  remote:     { label: 'REMOTE',     color: '#38BDF8', bg: '#0A1E2A' },
}

export function getJobTypeMeta(type) {
  return JOB_TYPE_META[type] ?? { label: type?.toUpperCase() ?? '?', color: '#8B92A0', bg: '#1F222A' }
}

export const STATUS_META = {
  pending:   { label: 'Pending',   color: 'text-accent',  bg: 'bg-accent/10' },
  reviewed:  { label: 'Reviewed',  color: 'text-teal',    bg: 'bg-teal/10' },
  accepted:  { label: 'Accepted',  color: 'text-teal',    bg: 'bg-teal/20' },
  rejected:  { label: 'Rejected',  color: 'text-danger',  bg: 'bg-danger/10' },
}

export function getStatusMeta(status) {
  return STATUS_META[status] ?? { label: status, color: 'text-muted', bg: 'bg-surface-light' }
}
