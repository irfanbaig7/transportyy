import { Link, useLocation } from 'react-router-dom'
import { Home, Route as RouteIcon, Plus, MessageCircle, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function BottomNav() {
  const { pathname } = useLocation()
  const { role } = useApp()
  const homePath = role === 'driver' ? '/driver/dashboard' : '/home'
  const isDriver = role === 'driver'

  const isActive = (paths) => paths.some((p) => pathname === p || pathname.startsWith(p + '/'))

  const left = [
    { icon: Home, label: 'Home', to: homePath, match: [homePath, '/home', '/driver/dashboard'] },
    { icon: RouteIcon, label: 'Trips', to: '/trips', match: ['/trips'] },
  ]
  const right = [
    { icon: MessageCircle, label: 'Messages', to: '/messages', match: ['/messages', '/chat'] },
    { icon: User, label: 'Profile', to: '/profile', match: ['/profile'] },
  ]

  return (
    <div className="relative shrink-0 bg-surface border-t border-line">
      {isDriver && (
        <Link
          to="/post/route"
          aria-label="Post a ride"
          className="tap absolute left-1/2 -translate-x-1/2 -top-6 h-14 w-14 rounded-full bg-brand grid place-items-center text-white shadow-[var(--shadow-float)] active:scale-95 transition"
        >
          <Plus size={26} />
        </Link>
      )}
      <div className={`grid ${isDriver ? 'grid-cols-5' : 'grid-cols-4'} items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]`}>
        {left.map((t) => <Tab key={t.label} {...t} active={isActive(t.match)} />)}
        {isDriver && <span aria-hidden />}
        {right.map((t) => <Tab key={t.label} {...t} active={isActive(t.match)} />)}
      </div>
    </div>
  )
}

function Tab({ icon: Icon, label, to, active }) {
  return (
    <Link to={to} className="tap flex flex-col items-center justify-center gap-0.5">
      <Icon size={22} className={active ? 'text-brand' : 'text-muted'} strokeWidth={active ? 2.4 : 2} />
      <span className={`text-[10px] font-medium ${active ? 'text-brand' : 'text-muted'}`}>{label}</span>
    </Link>
  )
}