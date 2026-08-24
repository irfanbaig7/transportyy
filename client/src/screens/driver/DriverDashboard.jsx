import { Link } from 'react-router-dom'
import { Bell, Route as RouteIcon, Wallet, CalendarCheck, Inbox, MapPin } from 'lucide-react'
import { Screen, TopBar, BottomNav, Avatar, Badge, Toggle } from '../../components'
import { useApp } from '../../context/AppContext'

export default function DriverDashboard() {
    const { user, isAvailable, toggleAvailability, driverTrips, pendingRequests } = useApp()

    return (
        <Screen
            header={
                <TopBar
                    back={false}
                    title={`Hi, ${user.name.split(' ')[0]} 👋`}
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
                {driverTrips[0] && (
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={15} className="text-brand" />
                        <span className="font-semibold text-ink">{driverTrips[0].from} → {driverTrips[0].to}</span>
                    </div>
                )}
                {driverTrips[0] && (
                    <p className="text-xs text-muted mt-1">
                        {driverTrips[0].date}, {driverTrips[0].time} · {driverTrips[0].seatsTotal - driverTrips[0].seatsBooked} Seats Available
                    </p>
                )}
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4 flex items-center gap-3">
                <Avatar name={user.name} size="md" />
                <div className="flex-1">
                    <p className="text-xs font-semibold text-muted">Car Details</p>
                    <p className="font-bold text-ink">{user.car.brand}</p>
                    <p className="text-xs text-muted">{user.car.number} · {user.car.year} · {user.car.type}</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5">
                <QuickAction icon={RouteIcon} label="My Trips" to="/trips" />
                <QuickAction icon={Wallet} label="Earnings" to="/driver/earnings" />
                <QuickAction icon={CalendarCheck} label="Availability" to="/driver/dashboard" />
                <QuickAction icon={Inbox} label="Requests" to="/driver/requests" badge={pendingRequests} />
            </div>

            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink">Upcoming Trips</p>
                <Link to="/trips" className="text-xs font-semibold text-brand">View All</Link>
            </div>
            {driverTrips.map((t) => (
                <Link key={t.id} to="/trips" className="tap block rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-1">
                        <MapPin size={14} className="text-brand" /> {t.from} → {t.to}
                    </div>
                    <p className="text-xs text-muted">{t.date}, {t.time}</p>
                    <Badge tone="green" className="mt-2">{t.seatsBooked} Seats Booked</Badge>
                </Link>
            ))}
        </Screen>
    )
}

function QuickAction({ icon: Icon, label, to, badge }) {
    return (
        <Link to={to} className="tap relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-surface border border-line">
            {badge > 0 && (
                <span className="absolute top-1 right-1.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold grid place-items-center">
                    {badge}
                </span>
            )}
            <Icon size={18} className="text-brand" />
            <span className="text-[10px] font-medium text-ink text-center leading-tight">{label}</span>
        </Link>
    )
}