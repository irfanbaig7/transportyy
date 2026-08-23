import { Star } from 'lucide-react'

export default function Rating({ value = 0, count, size = 14, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-ink">{value}</span>
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </span>
  )
}
