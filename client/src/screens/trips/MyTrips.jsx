import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Route as RouteIcon } from 'lucide-react'
import { Screen, TopBar, BottomNav, RouteLine, Badge, EmptyState } from '../../components'
import { useApp } from '../../context/AppContext'

const TABS = ['upcoming', 'ongoing', 'completed', 'cancelled']

export default function MyTrips() {
    const [tab, setTab] = useState('upcoming')
    const { trips, refreshMyTrips } = useApp()

    useEffect(() => {
        refreshMyTrips()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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