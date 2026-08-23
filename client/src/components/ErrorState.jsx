import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please check your connection and try again.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="h-16 w-16 rounded-2xl bg-red-50 grid place-items-center mb-4">
        <AlertTriangle size={28} className="text-red-500" />
      </span>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted max-w-[260px]">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
