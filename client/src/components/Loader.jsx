export function Spinner({ size = 22, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-brand/25 border-t-brand ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function Skeleton({ className = '' }) {
  return <span className={`block animate-pulse rounded-lg bg-line/70 ${className}`} />
}

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner size={30} />
      <p className="text-sm text-muted">{label}</p>
    </div>
  )
}
