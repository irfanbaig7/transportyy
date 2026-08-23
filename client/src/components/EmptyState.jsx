import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="h-16 w-16 rounded-2xl bg-brand-tint grid place-items-center mb-4">
        <Icon size={28} className="text-brand" />
      </span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {message && <p className="mt-1 text-sm text-muted max-w-[240px]">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
