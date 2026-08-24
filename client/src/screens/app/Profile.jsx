import { Link } from 'react-router-dom'
import { Star, Route as RouteIcon, ShieldCheck, ChevronRight, Settings, HelpCircle, Menu as MenuIcon } from 'lucide-react'
import { Screen, TopBar, BottomNav, Avatar, Button, Badge } from '../../components'
import { useApp } from '../../context/AppContext'

export default function Profile() {
    const { user } = useApp()
    return (
        <Screen header={<TopBar title="Profile" back={false} />} footer={<BottomNav />}>
            <div className="flex flex-col items-center text-center mb-5">
                <Avatar name={user.name} size="xl" />
                <h2 className="text-lg font-extrabold text-ink mt-3">{user.name}</h2>
                <p className="text-sm text-muted">{user.phone}</p>
                {user.verified && <Badge tone="green" icon={ShieldCheck} className="mt-2">Verified</Badge>}
                <Button size="sm" variant="outline" to="/profile/edit" className="mt-4">Edit Profile</Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
                <Stat icon={Star} label="Rating" value={user.rating} />
                <Stat icon={RouteIcon} label="Trips" value={user.tripsCount} />
                <Stat icon={ShieldCheck} label="Member" value={user.memberSince} />
            </div>

            <div className="rounded-2xl bg-surface border border-line divide-y divide-line overflow-hidden">
                <MenuRow to="/menu" icon={MenuIcon} label="Menu" />
                <MenuRow to="/settings" icon={Settings} label="Settings" />
                <MenuRow to="/help" icon={HelpCircle} label="Help & Support" />
            </div>
        </Screen>
    )
}

function Stat({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-line bg-surface p-3 text-center">
            <Icon size={16} className="text-brand mx-auto mb-1" />
            <p className="text-sm font-bold text-ink">{value}</p>
            <p className="text-[10px] text-muted">{label}</p>
        </div>
    )
}

function MenuRow({ to, icon: Icon, label }) {
    return (
        <Link to={to} className="tap flex items-center gap-3 px-4 py-3.5">
            <Icon size={18} className="text-muted" />
            <span className="flex-1 text-sm font-medium text-ink">{label}</span>
            <ChevronRight size={16} className="text-muted" />
        </Link>
    )
}