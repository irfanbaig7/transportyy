// Fixed action bar that sits at the bottom of a Screen (pass as `footer`).
export default function StickyCTA({ children, className = '' }) {
  return (
    <div className={`shrink-0 bg-surface border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] ${className}`}>
      {children}
    </div>
  )
}
