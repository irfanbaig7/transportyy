import { useParams, useNavigate } from 'react-router-dom'
import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Avatar, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function TripOngoing() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById, completeTrip } = useApp()
    const t = getTripById(id)
    if (!t) return null
    const progress = Math.round((t.progress || 0.4) * 100)

    const finish = () => {
        completeTrip(t.id)
        navigate(`/trips/${t.id}/completed`)
    }

    return (
        <Screen
            header={<TopBar title="Trip in Progress" />}
            footer={<StickyCTA><Button full onClick={finish}>Mark as Completed</Button></StickyCTA>}
        >
            <div className="h-40 rounded-2xl bg-brand-tint grid place-items-center mb-4">
                <MapPin size={40} className="text-brand" />
            </div>
            <div className="mb-4">
                <div className="h-2 rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted mt-1.5">{progress}% of the trip completed</p>
            </div>
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Avatar name={t.driver.name} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{t.driver.name}</p>
                    <p className="text-xs text-muted">{t.from} → {t.to}</p>
                </div>
                <div className="flex gap-2">
                    <button className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><MessageCircle size={16} className="text-brand" /></button>
                    <button className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><Phone size={16} className="text-brand" /></button>
                </div>
            </div>
        </Screen>
    )
}