import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Phone, MessageCircle, KeyRound } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, Avatar, Badge, StickyCTA, Spinner, Input } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function TripDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, startTrip, socket } = useApp()

    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [otp, setOtp] = useState('')
    const [starting, setStarting] = useState(false)
    const [connecting, setConnecting] = useState(false)
    const [err, setErr] = useState('')

    const load = () => {
        api.getBooking(id)
            .then((d) => setBooking(d.booking))
            .catch(() => setBooking(null))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        if (!socket) return
        const onUpdate = (b) => { if (String(b._id) === String(id)) load() }
        socket.on('booking:updated', onUpdate)
        return () => socket.off('booking:updated', onUpdate)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, id])

    if (loading) {
        return (
            <Screen header={<TopBar title="Trip Details" />}>
                <div className="flex justify-center py-16"><Spinner size={30} /></div>
            </Screen>
        )
    }

    if (!booking || !user) {
        return (
            <Screen header={<TopBar title="Trip Details" />}>
                <p className="text-sm text-muted mt-6">This trip couldn't be found.</p>
            </Screen>
        )
    }

    const isDriver = String(booking.driver?._id) === String(user._id)
    const other = isDriver ? (booking.passenger || {}) : (booking.driver || {})
    const car = booking.driver?.car || {}
    const ride = booking.ride || {}
    const from = ride.from || '—'
    const to = ride.to || '—'
    const via = ride.via
    const date = ride.date || '—'
    const time = ride.time || '—'
    const otherId = other._id

    const beginTrip = async () => {
        setErr('')
        if (!/^\d{4}$/.test(otp)) {
            setErr("Enter the 4-digit OTP the passenger tells you.")
            return
        }
        setStarting(true)
        try {
            await startTrip(booking._id, otp)
            navigate(`/trips/${booking._id}/ongoing`)
        } catch (e) {
            setErr(e.message || 'Could not start trip.')
        } finally {
            setStarting(false)
        }
    }

    const openChat = async () => {
        if (!otherId) return
        setErr(''); setConnecting(true)
        try {
            const d = await api.startChat(otherId)
            navigate(`/chat/${d.chat._id || d.chat.id}`)
        } catch (e) {
            setErr(e.message || 'Could not start chat.')
        } finally { setConnecting(false) }
    }

    const callOther = async () => {
        if (!otherId) return
        setErr(''); setConnecting(true)
        try {
            const d = await api.startChat(otherId)
            navigate(`/call/${d.chat._id || d.chat.id}`, { state: { role: 'caller', otherUserId: otherId, otherUserName: other.name || 'User' } })
        } catch (e) {
            setErr(e.message || 'Could not start call.')
        } finally { setConnecting(false) }
    }

    return (
        <Screen
            header={<TopBar title="Trip Details" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}

                    {!isDriver && booking.status === 'upcoming' && (
                        <Button variant="outline" full onClick={() => navigate(`/trips/${booking._id}/cancel`)}>Cancel Booking</Button>
                    )}

                    {isDriver && booking.status === 'upcoming' && (
                        <div className="space-y-2">
                            <Input
                                label="Enter pickup OTP"
                                placeholder="4-digit code from passenger"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            />
                            <Button full onClick={beginTrip} disabled={starting}>{starting ? 'Starting…' : 'Start Trip'}</Button>
                        </div>
                    )}

                    {booking.status === 'ongoing' && (
                        <Button full onClick={() => navigate(`/trips/${booking._id}/ongoing`)}>
                            {isDriver ? 'Continue Trip' : 'Track Trip'}
                        </Button>
                    )}
                    {booking.status === 'completed' && !isDriver && !booking.rated && (
                        <Button full onClick={() => navigate(`/trips/${booking._id}/rate`)}>Rate this Trip</Button>
                    )}
                </StickyCTA>
            }
        >
            <div className="flex items-center justify-between mb-4">
                <Badge tone={booking.status === 'completed' ? 'green' : booking.status === 'cancelled' ? 'red' : 'blue'}>{booking.status}</Badge>
                {!isDriver && booking.otp && booking.status === 'upcoming' && (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-ink"><KeyRound size={14} className="text-brand" /> OTP: {booking.otp}</span>
                )}
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine from={from} to={to} via={via} />
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-line text-sm">
                    <div><p className="text-xs text-muted">Date</p><p className="font-semibold text-ink">{date}</p></div>
                    <div><p className="text-xs text-muted">Time</p><p className="font-semibold text-ink">{time}</p></div>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4 flex items-center gap-3">
                <Avatar name={other.name || (isDriver ? 'Passenger' : 'Driver')} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{other.name || (isDriver ? 'Passenger' : 'Driver')} {other.rating ? `★ ${other.rating}` : ''}</p>
                    {!isDriver && <p className="text-xs text-muted">{car.brand || 'Car'} {car.number ? `· ${car.number}` : ''}</p>}
                    {isDriver && <p className="text-xs text-muted">{booking.seats} seat(s)</p>}
                </div>
                <div className="flex gap-2">
                    <button onClick={openChat} disabled={connecting} className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center disabled:opacity-50">
                        <MessageCircle size={16} className="text-brand" />
                    </button>
                    <button onClick={callOther} disabled={connecting} className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center disabled:opacity-50">
                        <Phone size={16} className="text-brand" />
                    </button>
                </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm font-bold text-ink mb-3">Price Details</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted">₹{booking.pricePerSeat} x {booking.seats} Seat(s)</span><span className="text-ink">₹{booking.pricePerSeat * booking.seats}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Platform Fee</span><span className="text-ink">₹{booking.platformFee ?? 0}</span></div>
                    <div className="flex justify-between pt-2 border-t border-line font-bold text-ink"><span>Total</span><span>₹{booking.total}</span></div>
                </div>
            </div>
        </Screen>
    )
}