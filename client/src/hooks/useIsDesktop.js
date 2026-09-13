import { useState, useEffect } from 'react'

// lg breakpoint (1024px) — isse upar "real desktop layout" (sidebar wala) dikhega,
// isse niche phone-frame simulation dikhega (jo phones/tablets ke liye theek hai).
const DESKTOP_BREAKPOINT = 1024

export function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= DESKTOP_BREAKPOINT : false
    )

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
        const handler = (e) => setIsDesktop(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    return isDesktop
}