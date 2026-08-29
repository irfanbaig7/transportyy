import { Star } from 'lucide-react'

export default function Rating({ value = 0, count, size = 14, className = '' }) {
  if (value == null) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span className="text-sm font-semibold text-muted">New driver</span>
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </span>
  )
}