import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button, RouteLine } from '../../components'
import { useApp } from '../../context/AppContext'

export default function TripCompleted() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById } = useApp()
    const t = getTripById(id)
    if (!t) return null

    const from = t.from || t.ride?.from || '—'
    const to = t.to || t.ride?.to || '—'
    const date = t.date || t.ride?.date
    const time = t.time || t.ride?.time

    return (
        <div className="flex flex-col h-full px-6 pt-10 pb-6">
            <div className="flex flex-col items-center text-center mb-6">
                <span className="h-16 w-16 rounded-full bg-brand-light grid place-items-center mb-4">
                    <CheckCircle2 size={36} className="text-brand" />
                </span>
                <h1 className="text-xl font-extrabold text-ink">Trip Completed!</h1>
                <p className="text-sm text-muted mt-1">Hope you had a safe journey.</p>
            </div>
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine compact from={from} to={to} />
                <p className="text-xs text-muted mt-2">{date} {time ? `· ${time}` : ''} · Total Paid ₹{t.total}</p>
            </div>
            <div className="flex-1" />
            <div className="space-y-3">
                {!t.rated && <Button full onClick={() => navigate(`/trips/${t._id || t.id}/rate`)}>Rate this Trip</Button>}
                <Button full variant="outline" to="/trips">Back to Trips</Button>
            </div>
        </div>
    )
}