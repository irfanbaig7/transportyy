import { createPortal } from 'react-dom'

// Bottom sheet / modal that stays inside the phone frame (#device-layer).
export default function Sheet({ open, onClose, title, children }) {
  const layer = typeof document !== 'undefined' ? document.getElementById('device-layer') : null
  if (!open || !layer) return null
  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-t-3xl px-5 pt-3 pb-7 anim-in max-h-[86%] overflow-y-auto no-scrollbar">
        <span className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-line" />
        {title && <h3 className="text-lg font-bold text-ink mb-3">{title}</h3>}
        {children}
      </div>
    </div>,
    layer
  )
}
