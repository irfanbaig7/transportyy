
// The phone-width app shell. On desktop it centers a device-sized column;
// on mobile it fills the screen. All overlays (sheets/modals) portal into
// #device-layer so they stay inside the frame.
export default function Device({ children }) {
  return (
    <div className="min-h-screen w-full flex items-stretch sm:items-center justify-center sm:py-8">
      <div className="relative w-full sm:w-[400px] h-[100dvh] sm:h-[820px] sm:max-h-[92vh] bg-canvas flex flex-col overflow-hidden sm:rounded-[2.6rem] sm:shadow-2xl sm:ring-1 sm:ring-black/5">
        <main className="flex-1 min-h-0 flex flex-col">{children}</main>
        <div id="device-layer" className="pointer-events-none absolute inset-0 z-50" />
      </div>
    </div>
  )
}
