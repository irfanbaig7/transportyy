import { useParams, useNavigate, Link } from 'react-router-dom'
import { Phone, MessageCircle, KeyRound } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, Avatar, Badge, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function TripDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById } = useApp()
    const t = getTripById(id)
    if (!t) return null

    return (
        <Screen
            header={<TopBar title="Trip Details" />}
            footer={
                <StickyCTA>
                    {t.status === 'upcoming' && (
                        <div className="flex gap-3">
                            <Button variant="outline" full onClick={() => navigate(`/trips/${t.id}/cancel`)}>Cancel</Button>
                            <Button full onClick={() => navigate(`/trips/${t.id}/ongoing`)}>Start Trip</Button>
                        </div>
                    )}
                    {t.status === 'ongoing' && <Button full onClick={() => navigate(`/trips/${t.id}/ongoing`)}>Track Trip</Button>}
                    {t.status === 'completed' && !t.rated && <Button full onClick={() => navigate(`/trips/${t.id}/rate`)}>Rate this Trip</Button>}
                </StickyCTA>
            }
        >
            <div className="flex items-center justify-between mb-4">
                <Badge tone={t.status === 'completed' ? 'green' : t.status === 'cancelled' ? 'red' : 'blue'}>{t.status}</Badge>
                {t.otp && t.status === 'upcoming' && (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink"><KeyRound size={14} className="text-brand" /> OTP: {t.otp}</span>
                )}
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine from={t.from} to={t.to} via={t.via} />
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-line text-sm">
                    <div><p className="text-xs text-muted">Date</p><p className="font-semibold text-ink">{t.date}</p></div>
                    <div><p className="text-xs text-muted">Time</p><p className="font-semibold text-ink">{t.time}</p></div>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4 flex items-center gap-3">
                <Avatar name={t.driver.name} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{t.driver.name} ★ {t.driver.rating}</p>
                    <p className="text-xs text-muted">{t.car.brand} · {t.car.number}</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/messages" className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><MessageCircle size={16} className="text-brand" /></Link>
                    <button className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><Phone size={16} className="text-brand" /></button>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm font-bold text-ink mb-3">Price Details</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted">₹{t.pricePerSeat} x {t.seats} Seat(s)</span><span className="text-ink">₹{t.pricePerSeat * t.seats}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Platform Fee</span><span className="text-ink">₹{t.fee}</span></div>
                    <div className="flex justify-between pt-2 border-t border-line font-bold text-ink"><span>Total</span><span>₹{t.total}</span></div>
                </div>
            </div>
        </Screen>
    )
}