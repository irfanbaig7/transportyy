import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-darker shadow-sm',
  outline: 'bg-surface text-ink border border-line hover:border-brand hover:text-brand',
  ghost: 'bg-transparent text-brand hover:bg-brand-tint',
  soft: 'bg-brand-light text-brand-darker hover:bg-brand-light/70',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  dark: 'bg-ink text-white hover:opacity-90',
}
const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-14 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  to,
  onClick,
  type = 'button',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  children,
  className = '',
}) {
  const cls = `tap inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`
  const inner = (
    <>
      {Icon && <Icon size={18} />}
      {children}
      {IconRight && <IconRight size={18} />}
    </>
  )
  if (to && !disabled) return <Link to={to} className={cls}>{inner}</Link>
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  )
}
