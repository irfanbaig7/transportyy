import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bell, ArrowRight, Users } from 'lucide-react'
import { Screen, TopBar, BottomNav, Button, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function Home() {
    const navigate = useNavigate()
    const { user, unreadNotifications, setSearch, refreshNotifications, socket } = useApp()

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
                        <Link to="/notifications" className="tap relative h-9 w-9 grid place-items-center rounded-full hover:bg-black/5 lg:hidden">
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
                className="tap w-full flex items-center gap-3 rounded-2xl bg-surface border border-line p-4 lg:p-6 shadow-[var(--shadow-card)] mb-5 lg:mb-8 text-left"
            >
                <span className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-brand-tint grid place-items-center"><MapPin size={18} className="text-brand" /></span>
                <span className="flex-1">
                    <span className="block text-sm lg:text-base font-semibold text-ink">Search a ride</span>
                    <span className="block text-xs lg:text-sm text-muted">Enter pickup & destination</span>
                </span>
                <ArrowRight size={18} className="text-muted" />
            </button>

            <div className="flex items-center justify-between mb-2 lg:mb-4">
                <p className="text-sm lg:text-lg font-bold text-ink">Popular Routes</p>
                {popular.length > 0 && <span className="text-[11px] lg:text-xs text-muted">Most recently posted first</span>}
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
                    className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-x-auto lg:overflow-visible no-scrollbar mb-6 -mx-5 px-5 lg:mx-0 lg:px-0 cursor-grab active:cursor-grabbing select-none"
                >
                    {popular.map((r, i) => (
                        <button
                            key={`${r.from}-${r.to}-${i}`}
                            onClick={() => pickRoute(r)}
                            className="tap shrink-0 w-44 lg:w-auto rounded-2xl bg-surface border border-line p-3.5 lg:p-5 text-left hover:border-brand transition"
                        >
                            <p className="text-sm lg:text-base font-semibold text-ink">{r.from} → {r.to}</p>
                            <p className="text-xs lg:text-sm text-muted mt-1">from ₹{r.price}</p>
                            <p className="mt-2 inline-flex items-center gap-1 text-[11px] lg:text-xs font-semibold text-brand">
                                <Users size={11} /> {r.count} ride{r.count > 1 ? 's' : ''} available
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted mb-6">No rides posted yet. Be the first to post one!</p>
            )}
        </Screen>
    )
}