import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Bell, Route as RouteIcon, Wallet, MapPin } from 'lucide-react'
import { Screen, TopBar, BottomNav, Avatar, Badge, Toggle } from '../../components'
import { useApp } from '../../context/AppContext'

export default function DriverDashboard() {
    const { user, isAvailable, toggleAvailability, driverTrips, refreshMyRides } = useApp()
    const upcomingRides = driverTrips.filter((t) => t.status === 'active')

    useEffect(() => {
        refreshMyRides()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!user) {
        return (
            <Screen header={<TopBar back={false} title="Dashboard" />} footer={<BottomNav />}>
                <p className="text-sm text-muted mt-6">Loading your details…</p>
            </Screen>
        )
    }

    const firstName = user.name ? user.name.split(' ')[0] : 'there'

    return (
        <Screen
            header={
                <TopBar
                    back={false}
                    title={`Hi, ${firstName} 👋`}
                    subtitle={isAvailable ? "You're currently available" : "You're offline"}
                    right={
                        <Link to="/notifications" className="tap h-9 w-9 grid place-items-center rounded-full hover:bg-black/5">
                            <Bell size={20} className="text-ink" />
                        </Link>
                    }
                />
            }
            footer={<BottomNav />}
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-ink">Today's Availability</p>
                    <Toggle checked={isAvailable} onChange={toggleAvailability} />
                </div>
                {upcomingRides[0] && (
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={15} className="text-brand" />
                        <span className="font-semibold text-ink">{upcomingRides[0].from} → {upcomingRides[0].to}</span>
                    </div>
                )}
                {upcomingRides[0] && (
                    <p className="text-xs text-muted mt-1">
                        {upcomingRides[0].date}, {upcomingRides[0].time} · {upcomingRides[0].seatsAvailable ?? 0} Seats Available
                    </p>
                )}
                {!upcomingRides.length && (
                    <p className="text-xs text-muted">No rides posted yet. Tap + below to post one.</p>
                )}
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4 flex items-center gap-3">
                <Avatar name={user.name || '?'} size="md" />
                <div className="flex-1">
                    <p className="text-xs font-semibold text-muted">Car Details</p>
                    {user.car?.brand ? (
                        <>
                            <p className="font-bold text-ink">{user.car.brand}</p>
                            <p className="text-xs text-muted">{user.car.number || '—'} · {user.car.year || '—'} · {user.car.type || '—'}</p>
                        </>
                    ) : (
                        <p className="text-sm text-muted">
                            No car added yet.{' '}
                            <Link to="/driver/car" className="text-brand font-semibold">Add now</Link>
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
                <QuickAction icon={RouteIcon} label="My Trips" to="/trips" />
                <QuickAction icon={Wallet} label="Earnings" to="/driver/earnings" />
            </div>

            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink">Upcoming Trips</p>
                <Link to="/trips" className="text-xs font-semibold text-brand">View All</Link>
            </div>
            {upcomingRides.length ? (
                upcomingRides.map((t) => (
                    <Link key={t._id || t.id} to="/trips" className="tap block rounded-2xl bg-surface border border-line p-4 shadow-(--shadow-card)">
                        <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-1">
                            <MapPin size={14} className="text-brand" /> {t.from} → {t.to}
                        </div>
                        <p className="text-xs text-muted">{t.date}, {t.time}</p>
                        <Badge tone="green" className="mt-2">{(t.seatsTotal - t.seatsAvailable) || 0} Seats Booked</Badge>
                    </Link>
                ))
            ) : (
                <p className="text-sm text-muted">No upcoming trips.</p>
            )}
        </Screen>
    )
}

function QuickAction({ icon: Icon, label, to }) {
    return (
        <Link to={to} className="tap relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-surface border border-line">
            <Icon size={18} className="text-brand" />
            <span className="text-[10px] font-medium text-ink text-center leading-tight">{label}</span>
        </Link>
    )
}