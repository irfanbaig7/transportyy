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
                {requests.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar name={r.passenger.name} size="md" />
                            <div className="flex-1">
                                <p className="font-semibold text-ink">{r.passenger.name}</p>
                                <p className="text-xs text-muted">★ {r.passenger.rating} · {r.passenger.trips} trips</p>
                            </div>
                            <p className="font-extrabold text-ink">₹{r.amount}</p>
                        </div>
                        <p className="text-sm text-body mb-3">{r.from} → {r.to} · {r.date}, {r.time} · {r.seats} seat(s)</p>
                        {r.status === 'pending' ? (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" full onClick={() => rejectRequest(r.id)}>Reject</Button>
                                <Button size="sm" full onClick={() => acceptRequest(r.id)}>Accept</Button>
                            </div>
                        ) : (
                            <Badge tone={r.status === 'accepted' ? 'green' : 'red'}>{r.status}</Badge>
                        )}
                    </div>
                ))}
            </div>
        </Screen>
    )
}