export default function Input({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  hint,
  right,
  optional = false,
  name,
  className = '',
}) {
  const bind = value !== undefined ? { value, onChange } : { defaultValue, onChange }
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-[13px] font-medium text-ink">
          {label}
          {optional && <span className="text-muted font-normal"> (Optional)</span>}
        </span>
      )}
      <span className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl border border-line bg-surface focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 transition">
        {Icon && <Icon size={18} className="text-muted shrink-0" />}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          {...bind}
          className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-ink placeholder:text-muted"
        />
        {right}
      </span>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}
