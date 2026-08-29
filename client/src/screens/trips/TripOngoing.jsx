import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Avatar, StickyCTA, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function TripOngoing() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, socket } = useApp()

    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)
    const [completing, setCompleting] = useState(false)
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
            <Screen header={<TopBar title="Trip in Progress" />}>
                <div className="flex justify-center py-16"><Spinner size={30} /></div>
            </Screen>
        )
    }
    if (!booking || !user) return null

    const isDriver = String(booking.driver?._id) === String(user._id)
    const other = isDriver ? (booking.passenger || {}) : (booking.driver || {})
    const ride = booking.ride || {}
    const from = ride.from || '—'
    const to = ride.to || '—'
    const progress = Math.round((booking.progress || 0.4) * 100)
    const otherId = other._id

    const finish = async () => {
        setCompleting(true); setErr('')
        try {
            await api.completeBooking(booking._id)
            navigate(`/trips/${booking._id}/completed`)
        } catch (e) {
            setErr(e.message || 'Could not complete trip.')
        } finally { setCompleting(false) }
    }

    const openChat = async () => {
        if (!otherId) return
        setErr(''); setConnecting(true)
        try {
            const d = await api.startChat(otherId)
            navigate(`/chat/${d.chat._id || d.chat.id}`)
        } catch (e) { setErr(e.message || 'Could not start chat.') } finally { setConnecting(false) }
    }

    const callOther = async () => {
        if (!otherId) return
        setErr(''); setConnecting(true)
        try {
            const d = await api.startChat(otherId)
            navigate(`/call/${d.chat._id || d.chat.id}`, { state: { role: 'caller', otherUserId: otherId, otherUserName: other.name || 'User' } })
        } catch (e) { setErr(e.message || 'Could not start call.') } finally { setConnecting(false) }
    }

    return (
        <Screen
            header={<TopBar title="Trip in Progress" />}
            footer={isDriver ? (
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    <Button full onClick={finish} disabled={completing}>{completing ? 'Completing…' : 'Mark as Completed'}</Button>
                </StickyCTA>
            ) : null}
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
            {err && !isDriver && <p className="text-xs font-medium text-red-500 mb-3">{err}</p>}
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Avatar name={other.name || 'User'} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{other.name || 'User'}</p>
                    <p className="text-xs text-muted">{from} → {to}</p>
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
        </Screen>
    )
}