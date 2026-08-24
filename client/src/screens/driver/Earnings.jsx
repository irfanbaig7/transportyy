import { Screen, TopBar } from '../../components'
import { useApp } from '../../context/AppContext'
import { TrendingUp } from 'lucide-react'

export default function Earnings() {
    const { trips } = useApp()
    const completed = trips.filter((t) => t.status === 'completed')
    const total = completed.reduce((s, t) => s + t.total, 0)

    return (
        <Screen header={<TopBar title="Earnings" />}>
            <div className="rounded-2xl bg-brand text-white p-5 mb-5">
                <p className="text-sm opacity-90 flex items-center gap-1.5"><TrendingUp size={16} /> Total Earnings</p>
                <p className="text-3xl font-extrabold mt-1">₹{total}</p>
                <p className="text-xs opacity-80 mt-1">{completed.length} completed trips</p>
            </div>
            <p className="text-sm font-bold text-ink mb-2">Trip History</p>
            <div className="space-y-3">
                {completed.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-xl border border-line bg-surface p-4">
                        <div>
                            <p className="font-semibold text-ink text-sm">{t.from} → {t.to}</p>
                            <p className="text-xs text-muted">{t.date}</p>
                        </div>
                        <p className="font-bold text-ink">₹{t.total}</p>
                    </div>
                ))}
            </div>
        </Screen>
    )
}