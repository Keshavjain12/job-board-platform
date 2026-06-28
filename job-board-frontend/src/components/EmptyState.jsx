export default function EmptyState({ icon = '📋', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-xl text-text mb-2">{title}</h3>
      {description && <p className="text-muted text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
