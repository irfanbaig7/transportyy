import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button, RouteLine, Screen, TopBar, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function TripCompleted() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useApp()
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.getBooking(id)
            .then((d) => setBooking(d.booking))
            .catch(() => setBooking(null))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <Screen header={<TopBar title="Trip Completed" />}>
                <div className="flex justify-center py-16"><Spinner size={30} /></div>
            </Screen>
        )
    }
    if (!booking || !user) return null

    const isDriver = String(booking.driver?._id) === String(user._id)
    const ride = booking.ride || {}

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
                <RouteLine compact from={ride.from || '—'} to={ride.to || '—'} />
                <p className="text-xs text-muted mt-2">{ride.date} {ride.time ? `· ${ride.time}` : ''} · Total ₹{booking.total}</p>
            </div>
            <div className="flex-1" />
            <div className="space-y-3">
                {!isDriver && !booking.rated && <Button full onClick={() => navigate(`/trips/${booking._id}/rate`)}>Rate this Trip</Button>}
                <Button full variant="outline" to="/trips">Back to Trips</Button>
            </div>
        </div>
    )
}