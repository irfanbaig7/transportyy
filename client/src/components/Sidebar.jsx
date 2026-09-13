import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Route as RouteIcon, PlusCircle, MessageCircle, User, Bell, Menu as MenuIcon, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Avatar from './Avatar'

// Desktop-only persistent left navigation (BottomNav ka desktop equivalent).
// Device.jsx isse render karta hai sirf jab screen width >= 1024px ho.
export default function Sidebar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { role, user, unreadNotifications, logout } = useApp()
    const homePath = role === 'driver' ? '/driver/dashboard' : '/home'
    const isDriver = role === 'driver'

    const isActive = (paths) => paths.some((p) => pathname === p || pathname.startsWith(p + '/'))

    const items = [
        { icon: Home, label: 'Home', to: homePath, match: [homePath, '/home', '/driver/dashboard'] },
        { icon: RouteIcon, label: 'Trips', to: '/trips', match: ['/trips'] },
        ...(isDriver ? [{ icon: PlusCircle, label: 'Post a Ride', to: '/post/route', match: ['/post'] }] : []),
        { icon: MessageCircle, label: 'Messages', to: '/messages', match: ['/messages', '/chat'] },
        { icon: Bell, label: 'Notifications', to: '/notifications', match: ['/notifications'], badge: unreadNotifications },
        { icon: User, label: 'Profile', to: '/profile', match: ['/profile'] },
        { icon: MenuIcon, label: 'Menu', to: '/menu', match: ['/menu'] },
    ]

    const doLogout = () => {
        logout()
        navigate('/onboarding')
    }

    if (!user) return null

    return (
        <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-surface border-r border-line px-4 py-6">
            <div className="flex items-center gap-2.5 px-2 mb-8">
                <span className="h-9 w-9 rounded-xl bg-brand grid place-items-center text-white font-extrabold">C</span>
                <span className="text-lg font-extrabold text-ink">Chalo</span>
            </div>

            <div className="flex items-center gap-3 px-2 mb-6">
                <Avatar name={user.name || '?'} size="md" />
                <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{user.name}</p>
                    <p className="text-xs text-muted capitalize">{role}</p>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {items.map((it) => {
                    const active = isActive(it.match)
                    return (
                        <Link
                            key={it.label}
                            to={it.to}
                            className={`tap relative flex items-center gap-3 px-3 h-11 rounded-xl text-sm font-medium transition ${active ? 'bg-brand-tint text-brand-darker' : 'text-body hover:bg-canvas'
                                }`}
                        >
                            <it.icon size={19} strokeWidth={active ? 2.4 : 2} />
                            {it.label}
                            {it.badge > 0 && (
                                <span className="ml-auto h-5 min-w-5 px-1 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">
                                    {it.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <button onClick={doLogout} className="tap flex items-center gap-3 px-3 h-11 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
                <LogOut size={18} />
                Log Out
            </button>
        </aside>
    )
}