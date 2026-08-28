import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Minus, Plus, ShieldCheck, MessageCircle, Phone } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, Avatar, Rating, Badge, StickyCTA, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function RideDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { getRideById, socket } = useApp()   // socket bhi destructure karo

    // existing useEffect ke baad ADD KARO:
    useEffect(() => {
        if (!socket || !ride) return
        const onUpdate = (payload) => {
            if (String(payload.rideId) === String(ride._id || ride.id)) {
                api.getRide(id).then((d) => setRide(d.ride)).catch(() => { })
            }
        }
        socket.on('ride:updated', onUpdate)
        return () => socket.off('ride:updated', onUpdate)
    }, [socket, ride, id])

    const [ride, setRide] = useState(() => getRideById(id) || null)
    const [loading, setLoading] = useState(!ride)
    const [seats, setSeats] = useState(1)
    const [messaging, setMessaging] = useState(false)
    const [msgErr, setMsgErr] = useState('')

    useEffect(() => {
        if (ride) return
        setLoading(true)
        api.getRide(id)
            .then((d) => setRide(d.ride))
            .catch(() => setRide(null))
            .finally(() => setLoading(false))
    }, [id, ride])

    if (loading) {
        return (
            <Screen header={<TopBar title="Ride Details" />}>
                <div className="flex justify-center py-16"><Spinner size={30} /></div>
            </Screen>
        )
    }

    if (!ride) {
        return (
            <Screen header={<TopBar title="Ride Details" />}>
                <p className="text-sm text-muted mt-6">This ride couldn't be found. It may have been removed.</p>
            </Screen>
        )
    }

    const driver = ride.driver || {}
    const car = driver.car || ride.car || {}
    const tags = Array.isArray(driver.tags) ? driver.tags : []
    const total = ride.price * seats
    const driverId = driver._id || driver.id

    const openChat = async () => {
        if (!driverId) return
        setMsgErr('')
        setMessaging(true)
        try {
            const d = await api.startChat(driverId)
            navigate(`/chat/${d.chat._id || d.chat.id}`)
        } catch (e) {
            setMsgErr(e.message || 'Could not start chat.')
        } finally {
            setMessaging(false)
        }
    }

    const callDriver = async () => {
        if (!driverId) return
        setMsgErr('')
        setMessaging(true)
        try {
            const d = await api.startChat(driverId)
            navigate(`/call/${d.chat._id || d.chat.id}`, { state: { role: 'caller', otherUserId: driverId, otherUserName: driver.name || 'Driver' } })
        } catch (e) {
            setMsgErr(e.message || 'Could not start call.')
        } finally {
            setMessaging(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Ride Details" />}
            footer={
                <StickyCTA>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-muted">Total</span>
                        <span className="text-lg font-extrabold text-ink">₹{total}</span>
                    </div>
                    <Button
                        full
                        disabled={(ride.seatsAvailable ?? 0) <= 0}
                        onClick={() => navigate(`/booking/payment/${ride._id || ride.id}`, { state: { seats } })}
                    >
                        {(ride.seatsAvailable ?? 0) <= 0 ? 'Fully Booked' : 'Book Seat'}
                    </Button>
                </StickyCTA>
            }
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar name={driver.name || 'Driver'} size="lg" />
                    <div className="flex-1">
                        <p className="font-bold text-ink">{driver.name || 'Driver'}</p>
                        <Rating value={driver.rating ?? 0} count={driver.reviews ?? driver.ratingCount ?? 0} />
                    </div>
                    {driver.verified && <Badge tone="green" icon={ShieldCheck}>Verified</Badge>}
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((t) => <Badge key={t} tone="gray">{t}</Badge>)}
                    </div>
                )}
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
                <p className="font-bold text-ink">{car.brand || 'Not specified'}</p>
                <p className="text-sm text-muted">
                    {car.number || '—'} {car.type ? `· ${car.type}` : ''} {car.ac ? '· AC' : ''}
                </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)]">
                <span className="text-sm font-semibold text-ink">Seats ({ride.seatsAvailable ?? 0} available)</span>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSeats((s) => Math.max(1, s - 1))} className="tap h-9 w-9 rounded-lg border border-line grid place-items-center">
                        <Minus size={16} />
                    </button>
                    <span className="font-bold text-ink w-4 text-center">{seats}</span>
                    <button
                        onClick={() => setSeats((s) => Math.min(ride.seatsAvailable || 1, s + 1))}
                        className="tap h-9 w-9 rounded-lg border border-line grid place-items-center"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {msgErr && <p className="text-xs font-medium text-red-500 mt-3">{msgErr}</p>}

            <div className="flex gap-3 mt-4">
                <Button variant="outline" full icon={MessageCircle} onClick={openChat} disabled={messaging}>
                    {messaging ? 'Opening…' : 'Message'}
                </Button>
                <Button variant="outline" full icon={Phone} onClick={callDriver} disabled={messaging}>Call</Button>
            </div>
        </Screen>
    )
}