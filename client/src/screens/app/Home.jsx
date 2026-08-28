import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bell, ArrowRight, Users } from 'lucide-react'
import { Screen, TopBar, BottomNav, Button, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function Home() {
    const navigate = useNavigate()
    const { user, unreadNotifications, setSearch, refreshNotifications, socket } = useApp()

    // existing popularRoutes useEffect ke just baad ADD KARO:
    useEffect(() => {
        if (!socket) return
        const refetch = () => {
            api.popularRoutes().then((d) => setPopular(d.routes || [])).catch(() => { })
        }
        socket.on('ride:posted', refetch)
        socket.on('ride:updated', refetch)
        return () => {
            socket.off('ride:posted', refetch)
            socket.off('ride:updated', refetch)
        }
    }, [socket])

    const [popular, setPopular] = useState([])
    const [loadingRoutes, setLoadingRoutes] = useState(true)
    const scrollerRef = useRef(null)

    useEffect(() => {
        api.popularRoutes()
            .then((d) => setPopular(d.routes || []))
            .catch(() => setPopular([]))
            .finally(() => setLoadingRoutes(false))
    }, [])

    // Desktop mice don't drag horizontally by default — translate vertical
    // wheel motion into horizontal scroll, and support click-drag too, so the
    // strip is actually scrollable without needing a touchscreen.
    const onWheel = (e) => {
        const el = scrollerRef.current
        if (!el) return
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY
            e.preventDefault()
        }
    }

    const dragState = useRef({ down: false, startX: 0, startScroll: 0 })
    const onPointerDown = (e) => {
        const el = scrollerRef.current
        if (!el) return
        dragState.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft }
    }
    const onPointerMove = (e) => {
        const el = scrollerRef.current
        if (!el || !dragState.current.down) return
        el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX)
    }
    const endDrag = () => { dragState.current.down = false }

    const pickRoute = (r) => {
        setSearch({ from: r.from, to: r.to })
        navigate('/search')
    }

    if (!user) return null

    return (
        <Screen
            header={
                <TopBar
                    back={false}
                    title={`Hi, ${user.name.split(' ')[0]} 👋`}
                    subtitle="Where are you headed today?"
                    right={
                        <Link to="/notifications" className="tap relative h-9 w-9 grid place-items-center rounded-full hover:bg-black/5">
                            <Bell size={20} className="text-ink" />
                            {unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />}
                        </Link>
                    }
                />
            }
            footer={<BottomNav />}
        >
            <button
                onClick={() => navigate('/search')}
                className="tap w-full flex items-center gap-3 rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-5 text-left"
            >
                <span className="h-10 w-10 rounded-xl bg-brand-tint grid place-items-center"><MapPin size={18} className="text-brand" /></span>
                <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">Search a ride</span>
                    <span className="block text-xs text-muted">Enter pickup & destination</span>
                </span>
                <ArrowRight size={18} className="text-muted" />
            </button>

            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink">Popular Routes</p>
                {popular.length > 0 && <span className="text-[11px] text-muted">Most recently posted first</span>}
            </div>

            {loadingRoutes ? (
                <div className="flex justify-center py-6"><Spinner size={22} /></div>
            ) : popular.length ? (
                <div
                    ref={scrollerRef}
                    onWheel={onWheel}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerLeave={endDrag}
                    className="flex gap-3 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5 cursor-grab active:cursor-grabbing select-none"
                >
                    {popular.map((r, i) => (
                        <button
                            key={`${r.from}-${r.to}-${i}`}
                            onClick={() => pickRoute(r)}
                            className="tap shrink-0 w-44 rounded-2xl bg-surface border border-line p-3.5 text-left"
                        >
                            <p className="text-sm font-semibold text-ink">{r.from} → {r.to}</p>
                            <p className="text-xs text-muted mt-1">from ₹{r.price}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                                <Users size={11} /> {r.count} ride{r.count > 1 ? 's' : ''} available
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted mb-6">No rides posted yet. Be the first to post one!</p>
            )}

            <div className="rounded-2xl bg-neutral-900 text-white p-5 flex items-center gap-4">
                <div className="flex-1">
                    <p className="font-bold">Have a car? Start earning.</p>
                    <p className="text-xs opacity-70 mt-1">List your ride and offer seats.</p>
                </div>
                <Button size="sm" to="/driver/basic">Get Started</Button>
            </div>
        </Screen>
    )
}