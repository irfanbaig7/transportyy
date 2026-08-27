import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Phone, MessageCircle, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Avatar, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

export default function TripOngoing() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById, completeTrip } = useApp()
    const t = getTripById(id)
    const [connecting, setConnecting] = useState(false)
    const [err, setErr] = useState('')
    if (!t) return null

    const driver = t.driver || {}
    const from = t.from || t.ride?.from || '—'
    const to = t.to || t.ride?.to || '—'
    const progress = Math.round((t.progress || 0.4) * 100)
    const driverId = driver._id || driver.id

    const finish = () => {
        completeTrip(t._id || t.id)
        navigate(`/trips/${t._id || t.id}/completed`)
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
            header={<TopBar title="Trip in Progress" />}
            footer={<StickyCTA><Button full onClick={finish}>Mark as Completed</Button></StickyCTA>}
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
            {err && <p className="text-xs font-medium text-red-500 mb-3">{err}</p>}
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                <Avatar name={driver.name || 'Driver'} size="md" />
                <div className="flex-1">
                    <p className="font-semibold text-ink">{driver.name || 'Driver'}</p>
                    <p className="text-xs text-muted">{from} → {to}</p>
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
        </Screen>
    )
}