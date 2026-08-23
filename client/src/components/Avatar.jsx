const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

const palette = ['bg-brand', 'bg-emerald-500', 'bg-teal-600', 'bg-green-600', 'bg-lime-600', 'bg-cyan-600']

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Avatar({ name = '?', src, size = 'md', className = '' }) {
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover shrink-0 ${className}`} />
  }
  const idx = (name.charCodeAt(0) || 0) % palette.length
  return (
    <span
      className={`${sizes[size]} ${palette[idx]} rounded-full grid place-items-center text-white font-bold shrink-0 ${className}`}
    >
      {initials(name)}
    </span>
  )
}
