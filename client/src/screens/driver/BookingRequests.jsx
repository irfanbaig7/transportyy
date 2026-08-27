import { Screen, TopBar, Avatar, Badge, Button, EmptyState } from '../../components'
import { useApp } from '../../context/AppContext'
import { Inbox } from 'lucide-react'

export default function BookingRequests() {
    const { requests, acceptRequest, rejectRequest } = useApp()

    if (!requests.length) {
        return (
            <Screen header={<TopBar title="Booking Requests" />}>
                <EmptyState icon={Inbox} title="No requests yet" message="New booking requests will show up here." />
            </Screen>
        )
    }

    return (
        <Screen header={<TopBar title="Booking Requests" />}>
            <div className="space-y-3">
                {requests.map((r) => {
                    const passenger = r.passenger || {}
                    const ride = r.ride || {}
                    return (
                        <div key={r._id || r.id} className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar name={passenger.name || 'Passenger'} size="md" />
                                <div className="flex-1">
                                    <p className="font-semibold text-ink">{passenger.name || 'Passenger'}</p>
                                    <p className="text-xs text-muted">★ {passenger.rating ?? '—'} · {passenger.tripsCount ?? 0} trips</p>
                                </div>
                                <p className="font-extrabold text-ink">₹{r.total ?? 0}</p>
                            </div>
                            <p className="text-sm text-body mb-3">
                                {ride.from || '—'} → {ride.to || '—'} · {ride.date || '—'}, {ride.time || '—'} · {r.seats} seat(s)
                            </p>
                            {r.status === 'pending' ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" full onClick={() => rejectRequest(r._id || r.id)}>Reject</Button>
                                    <Button size="sm" full onClick={() => acceptRequest(r._id || r.id)}>Accept</Button>
                                </div>
                            ) : (
                                <Badge tone={r.status === 'upcoming' ? 'green' : 'red'}>{r.status}</Badge>
                            )}
                        </div>
                    )
                })}
            </div>
        </Screen>
    )
}