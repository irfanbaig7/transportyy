import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Route as RouteIcon } from 'lucide-react'
import { Screen, TopBar, BottomNav, RouteLine, Badge, EmptyState, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

const TABS = ['upcoming', 'ongoing', 'completed', 'cancelled']

// Ek ride ke bookings dekh ke uska "effective" status decide karta hai —
// driver ke liye "trip" uski posted ride hai, bookings uske andar hote hain.
function effectiveStatus(ride, bookings) {
    if (bookings.some((b) => b.status === 'ongoing')) return 'ongoing'
    if (ride.status === 'completed') return 'completed'
    if (ride.status === 'cancelled') return 'cancelled'
    return 'upcoming' // active ride — bookings ho ya na ho
}

export default function MyTrips() {
    const [tab, setTab] = useState('upcoming')
    const { user, trips, refreshMyTrips, socket } = useApp()
    const isDriver = user?.role === 'driver'

    const [driverRides, setDriverRides] = useState([])
    const [loadingDriver, setLoadingDriver] = useState(false)

    const loadDriverRides = useCallback(() => {
        setLoadingDriver(true)
        api.myRides()
            .then(async (d) => {
                const rides = d.rides || []
                const withBookings = await Promise.all(
                    rides.map(async (ride) => {
                        const b = await api.getRideBookings(ride._id).catch(() => ({ bookings: [] }))
                        const bookings = b.bookings || []
                        return { ride, bookings, status: effectiveStatus(ride, bookings) }
                    })
                )
                setDriverRides(withBookings)
            })
            .finally(() => setLoadingDriver(false))
    }, [])

    useEffect(() => {
        if (isDriver) loadDriverRides()
        else refreshMyTrips()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDriver])

    useEffect(() => {
        if (!socket) return
        const refetch = () => (isDriver ? loadDriverRides() : refreshMyTrips())
        socket.on('ride:posted', refetch)
        socket.on('ride:updated', refetch)
        socket.on('booking:new', refetch)
        socket.on('booking:updated', refetch)
        return () => {
            socket.off('ride:posted', refetch)
            socket.off('ride:updated', refetch)
            socket.off('booking:new', refetch)
            socket.off('booking:updated', refetch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, isDriver])

    // ---- Driver view ----
    if (isDriver) {
        const list = driverRides.filter((r) => r.status === tab)
        return (
            <Screen header={<TopBar title="My Trips" back={false} />} footer={<BottomNav />} padded={false}>
                <div className="flex gap-2 px-5 pt-4 pb-3 overflow-x-auto no-scrollbar">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`tap shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize ${tab === t ? 'bg-brand text-white' : 'bg-surface border border-line text-body'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 space-y-3">
                    {loadingDriver ? (
                        <div className="flex justify-center py-10"><Spinner size={26} /></div>
                    ) : list.length ? (
                        list.map(({ ride, bookings, status }) => (
                            <div key={ride._id} className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                                <div className="flex items-center justify-between mb-2">
                                    <RouteLine compact from={ride.from} to={ride.to} />
                                    <Badge tone={status === 'completed' ? 'green' : status === 'cancelled' ? 'red' : 'blue'}>{status}</Badge>
                                </div>
                                <p className="text-xs text-muted mb-3">
                                    {ride.date} · {ride.time} · {ride.seatsTotal - ride.seatsAvailable}/{ride.seatsTotal} seats booked
                                </p>

                                {bookings.length === 0 ? (
                                    <p className="text-xs text-muted">No bookings yet.</p>
                                ) : (
                                    <div className="space-y-1.5 pt-2 border-t border-line">
                                        {bookings.map((b) => (
                                            <Link
                                                key={b._id}
                                                to={`/trips/${b._id}`}
                                                className="tap flex items-center justify-between text-sm"
                                            >
                                                <span className="text-ink font-medium">{b.passenger?.name || 'Passenger'}</span>
                                                <span className="flex items-center gap-2 text-xs">
                                                    <span className="text-muted">{b.seats} seat(s)</span>
                                                    <Badge tone={b.status === 'completed' ? 'green' : b.status === 'cancelled' ? 'red' : 'blue'}>{b.status}</Badge>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <EmptyState icon={RouteIcon} title="No trips here" message="Trips in this category will show up here." />
                    )}
                </div>
            </Screen>
        )
    }

    // ---- Passenger view (unchanged) ----
    const list = trips.filter((t) => t.status === tab)
    return (
        <Screen header={<TopBar title="My Trips" back={false} />} footer={<BottomNav />} padded={false}>
            <div className="flex gap-2 px-5 pt-4 pb-3 overflow-x-auto no-scrollbar">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`tap shrink-0 px-4 py-2 rounded-full text-xs font-semibold capitalize ${tab === t ? 'bg-brand text-white' : 'bg-surface border border-line text-body'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4 space-y-3">
                {list.length ? (
                    list.map((t) => {
                        const from = t.from || t.ride?.from || '—'
                        const to = t.to || t.ride?.to || '—'
                        const date = t.date || t.ride?.date
                        const time = t.time || t.ride?.time
                        return (
                            <Link key={t._id || t.id} to={`/trips/${t._id || t.id}`} className="tap block rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                                <div className="flex items-center justify-between mb-2">
                                    <RouteLine compact from={from} to={to} />
                                    <Badge tone={t.status === 'completed' ? 'green' : t.status === 'cancelled' ? 'red' : 'blue'}>{t.status}</Badge>
                                </div>
                                <p className="text-xs text-muted">{date} {time ? `· ${time}` : ''} · {t.driver?.name || 'Driver'}</p>
                            </Link>
                        )
                    })
                ) : (
                    <EmptyState icon={RouteIcon} title="No trips here" message="Trips in this category will show up here." />
                )}
            </div>
        </Screen>
    )
}