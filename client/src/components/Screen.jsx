// Standard screen layout: fixed header, scrollable body, fixed footer.
// Usage: <Screen header={<TopBar .../>} footer={<BottomNav/> | <StickyCTA/>}>...</Screen>
export default function Screen({
  header = null,
  footer = null,
  children,
  padded = true,
  bg = 'bg-canvas',
  className = '',
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {header}
      <div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar ${padded ? 'px-5 py-4' : ''} ${bg} ${className}`}>
        {children}
      </div>
      {footer}
    </div>
  )
}
