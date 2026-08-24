import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bell, ArrowRight } from 'lucide-react'
import { Screen, TopBar, BottomNav, Button } from '../../components'
import { useApp } from '../../context/AppContext'
import * as mock from '../../data/mockData'

export default function Home() {
    const navigate = useNavigate()
    const { user, unreadNotifications, setSearch } = useApp()

    const pickRoute = (r) => {
        setSearch({ from: r.from, to: r.to })
        navigate('/search')
    }

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
            <button onClick={() => navigate('/search')} className="tap w-full flex items-center gap-3 rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-5 text-left">
                <span className="h-10 w-10 rounded-xl bg-brand-tint grid place-items-center"><MapPin size={18} className="text-brand" /></span>
                <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">Search a ride</span>
                    <span className="block text-xs text-muted">Enter pickup & destination</span>
                </span>
                <ArrowRight size={18} className="text-muted" />
            </button>

            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink">Popular Routes</p>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 -mx-5 px-5">
                {mock.popularRoutes.map((r, i) => (
                    <button key={i} onClick={() => pickRoute(r)} className="tap shrink-0 w-40 rounded-2xl bg-surface border border-line p-3.5 text-left">
                        <p className="text-sm font-semibold text-ink">{r.from} → {r.to}</p>
                        <p className="text-xs text-muted mt-1">from ₹{r.price}</p>
                    </button>
                ))}
            </div>

            <div className="rounded-2xl bg-ink text-white p-5 flex items-center gap-4">
                <div className="flex-1">
                    <p className="font-bold">Have a car? Start earning.</p>
                    <p className="text-xs opacity-70 mt-1">List your ride and offer seats.</p>
                </div>
                <Button size="sm" to="/driver/basic">Get Started</Button>
            </div>
        </Screen>
    )
}