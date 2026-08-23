const tones = {
  green: 'bg-brand-light text-brand-darker',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-slate-100 text-slate-600',
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-700',
  ink: 'bg-ink text-white',
}

export default function Badge({ children, tone = 'gray', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  )
}
