import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, subtitle, back = true, to, right = null, transparent = false }) {
  const navigate = useNavigate()
  const goBack = () => (to ? navigate(to) : navigate(-1))
  return (
    <div className={`flex items-center gap-1 px-3 h-14 shrink-0 ${transparent ? '' : 'bg-surface border-b border-line'}`}>
      {back ? (
        <button
          onClick={goBack}
          aria-label="Go back"
          className="tap h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 active:scale-95 transition"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
      ) : (
        <span className="w-3" />
      )}
      <div className="flex-1 min-w-0 px-1">
        {title && <h1 className="text-[17px] font-bold text-ink leading-tight truncate">{title}</h1>}
        {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
