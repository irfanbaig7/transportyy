// Standard screen layout: fixed header, scrollable body, fixed footer.
// Desktop (lg+) pe content ko max-width ke saath center kar deta hai, taaki
// full-width screen pe cards ekdum stretched na dikhein.
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
      <div className={`flex-1 min-h-0 overflow-y-auto no-scrollbar ${padded ? 'px-5 py-4 lg:px-10 lg:py-8' : ''} ${bg} ${className}`}>
        <div className="lg:max-w-5xl lg:mx-auto">
          {children}
        </div>
      </div>
      {footer}
    </div>
  )
}