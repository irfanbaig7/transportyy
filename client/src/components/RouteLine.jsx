import { MapPin } from 'lucide-react'

// Signature element: the origin→destination route line used across the app.
export default function RouteLine({ from, to, via, compact = false }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        <span>{from}</span>
        <span className="text-muted">→</span>
        <span>{to}</span>
      </span>
    )
  }
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-brand-light" />
        <span className="w-px flex-1 my-1 border-l-2 border-dashed border-brand/30 min-h-6" />
        <MapPin size={16} className="text-brand" fill="currentColor" />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-1 py-0.5">
        <p className="text-[15px] font-semibold text-ink leading-tight">{from}</p>
        {via && <p className="text-xs text-muted">via {via}</p>}
        <p className="text-[15px] font-semibold text-ink leading-tight">{to}</p>
      </div>
    </div>
  )
}
