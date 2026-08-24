import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Minus, Plus, ShieldCheck, MessageCircle, Phone } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, Avatar, Rating, Badge, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function RideDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getRideById } = useApp()
    const ride = getRideById(id)
    const [seats, setSeats] = useState(1)

    if (!ride) return null
    const total = ride.price * seats

    return (
        <Screen
            header={<TopBar title="Ride Details" />}
            footer={
                <StickyCTA>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted">Total</span>
                        <span className="text-lg font-extrabold text-ink">₹{total}</span>
                    </div>
                    <Button full onClick={() => navigate(`/booking/payment/${ride.id}`, { state: { seats } })}>Book Seat</Button>
                </StickyCTA>
            }
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar name={ride.driver.name} size="lg" />
                    <div className="flex-1">
                        <p className="font-bold text-ink">{ride.driver.name}</p>
                        <Rating value={ride.driver.rating} count={ride.driver.reviews} />
                    </div>
                    {ride.driver.verified && <Badge tone="green" icon={ShieldCheck}>Verified</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {ride.driver.tags.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine from={ride.from} to={ride.to} via={ride.via} />
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-line text-sm">
                    <div><p className="text-xs text-muted">Date</p><p className="font-semibold text-ink">{ride.date}</p></div>
                    <div><p className="text-xs text-muted">Time</p><p className="font-semibold text-ink">{ride.time}</p></div>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <p className="text-xs font-semibold text-muted mb-1">Car</p>
                <p className="font-bold text-ink">{ride.car.brand}</p>
                <p className="text-sm text-muted">{ride.car.number} · {ride.car.type} {ride.car.ac ? '· AC' : ''}</p>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                <span className="text-sm font-semibold text-ink">Seats ({ride.seatsAvailable} available)</span>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSeats((s) => Math.max(1, s - 1))} className="tap h-9 w-9 rounded-lg border border-line grid place-items-center"><Minus size={16} /></button>
                    <span className="font-bold text-ink w-4 text-center">{seats}</span>
                    <button onClick={() => setSeats((s) => Math.min(ride.seatsAvailable, s + 1))} className="tap h-9 w-9 rounded-lg border border-line grid place-items-center"><Plus size={16} /></button>
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <Button variant="outline" full icon={MessageCircle} to="/messages">Message</Button>
                <Button variant="outline" full icon={Phone}>Call</Button>
            </div>
        </Screen>
    )
}