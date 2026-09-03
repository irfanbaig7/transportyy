import { Link, useNavigate } from 'react-router-dom'
import { Car, Wallet, Inbox, MapPinned, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { Screen, TopBar } from '../../components'
import { useApp } from '../../context/AppContext'

const ITEMS = [
    { icon: Car, label: 'Become a Driver', to: '/driver/basic' },
    { icon: Wallet, label: 'Earnings', to: '/driver/earnings' },
    { icon: MapPinned, label: 'States Gallery', to: '/states' },
    { icon: Settings, label: 'Settings', to: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', to: '/help' },
]

export default function Menu() {
    const navigate = useNavigate()
    const { logout } = useApp()

    const doLogout = () => {
        logout()
        navigate('/onboarding')
    }

    return (
        <Screen header={<TopBar title="Menu" />}>
            <div className="rounded-2xl bg-surface border border-line divide-y divide-line overflow-hidden mb-4">
                {ITEMS.map((it) => (
                    <Link key={it.label} to={it.to} className="tap flex items-center gap-3 px-4 py-3.5">
                        <it.icon size={18} className="text-muted" />
                        <span className="flex-1 text-sm font-medium text-ink">{it.label}</span>
                        <ChevronRight size={16} className="text-muted" />
                    </Link>
                ))}
            </div>
            <button onClick={doLogout} className="tap w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-line text-red-500">
                <LogOut size={18} />
                <span className="text-sm font-semibold">Log Out</span>
            </button>
        </Screen>
    )
}