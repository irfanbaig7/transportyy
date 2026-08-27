import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Phone, MessageCircle, KeyRound } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, Avatar, Badge, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function TripDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById, startTrip } = useApp()
    const t = getTripById(id)
    const [starting, setStarting] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [err, setErr] = useState('')

    if (!t) return null

    const driver = t.driver || {}
    const car = driver.car || {}
    const from = t.from || t.ride?.from || '—'
    const to = t.to || t.ride?.to || '—'
    const via = t.via || t.ride?.via
    const date = t.date || t.ride?.date
    const time = t.time || t.ride?.time
    const driverId = driver._id || driver.id

    const beginTrip = async () => {
        setStarting(true)
        try {
            await startTrip(t._id || t.id)
            navigate(`/trips/${t._id || t.id}/ongoing`)
        } finally {
            setStarting(false)
        }
    }

    const openChat = async () => {
        if (!driverId) return
        setErr('')
        setConnecting(true)
        try {
            const d = await api.startChat(driverId)
            navigate(`/chat/${d.chat._id || d.chat.id}`)
        } catch (e) {
            setErr(e.message || 'Could not start chat.')
        } finally {
            setConnecting(false)
        }
    }

    const callDriver = async () => {
        if (!driverId) return
        setErr('')
        setConnecting(true)
        try {
            const d = await api.startChat(driverId)
            navigate(`/call/${d.chat._id || d.chat.id}`, { state: { role: 'caller', otherUserId: driverId, otherUserName: driver.name || 'Driver' } })
        } catch (e) {
            setErr(e.message || 'Could not start call.')
        } finally {
            setConnecting(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Trip Details" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    {t.status === 'upcoming' && (
                        <div className="flex gap-3">
                            <Button variant="outline" full onClick={() => navigate(`/trips/${t._id || t.id}/cancel`)}>Cancel</Button>
                            <Button full onClick={beginTrip} disabled={starting}>{starting ? 'Starting…' : 'Start Trip'}</Button>
                        </div>
                    )}
                    {t.status === 'ongoing' && <Button full onClick={() => navigate(`/trips/${t._id || t.id}/ongoing`)}>Track Trip</Button>}
                    {t.status === 'completed' && !t.rated && <Button full onClick={() => navigate(`/trips/${t._id || t.id}/rate`)}>Rate this Trip</Button>}
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
                <RouteLine from={from} to={to} via={via} />
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-line text-sm">
                    <div><p className="text-xs text-muted">Date</p><p className="font-semibold text-ink">{date || '—'}</p></div>
                    <div><p className="text-xs text-muted">Time</p><p className="font-semibold text-ink">{time || '—'}</p></div>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4 flex items-center gap-3">
                <Avatar name={driver.name || 'Driver'} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{driver.name || 'Driver'} {driver.rating ? `★ ${driver.rating}` : ''}</p>
                    <p className="text-xs text-muted">{car.brand || 'Car'} {car.number ? `· ${car.number}` : ''}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={openChat} disabled={connecting} className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center disabled:opacity-50">
                        <MessageCircle size={16} className="text-brand" />
                    </button>
                    <button onClick={callDriver} disabled={connecting} className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center disabled:opacity-50">
                        <Phone size={16} className="text-brand" />
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm font-bold text-ink mb-3">Price Details</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted">₹{t.pricePerSeat} x {t.seats} Seat(s)</span><span className="text-ink">₹{t.pricePerSeat * t.seats}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Platform Fee</span><span className="text-ink">₹{t.platformFee ?? t.fee ?? 0}</span></div>
                    <div className="flex justify-between pt-2 border-t border-line font-bold text-ink"><span>Total</span><span>₹{t.total}</span></div>
                </div>
            </div>
        </Screen>
    )
}