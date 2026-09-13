import { useIsDesktop } from '../hooks/useIsDesktop'
import Sidebar from './Sidebar'

// Ek hi baar mount hota hai (routes duplicate nahi hote — socket/data fetch
// dobara nahi chalta), lekin do alag layouts deta hai:
// - < 1024px (phone/tablet/chhoti window): purana phone-frame simulation
// - >= 1024px (real desktop): Sidebar + wide content area
export default function Device({ children }) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <div className="min-h-screen w-full flex bg-canvas">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
          {children}
        </div>
        <div id="device-layer" className="pointer-events-none fixed inset-0 z-50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-stretch sm:items-center justify-center sm:py-8">
      <div className="relative w-full sm:w-[400px] h-[100dvh] sm:h-[820px] sm:max-h-[92vh] bg-canvas flex flex-col overflow-hidden sm:rounded-[2.6rem] sm:shadow-2xl sm:ring-1 sm:ring-black/5">
        <main className="flex-1 min-h-0 flex flex-col">{children}</main>
        <div id="device-layer" className="pointer-events-none absolute inset-0 z-50" />
      </div>
    </div>
  )
}