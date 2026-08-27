import { Phone, PhoneOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Avatar from './Avatar'
import { useApp } from '../context/AppContext'

// Shown app-wide (portals into the phone frame) whenever a call:incoming
// socket event arrives — regardless of which screen the person is on.
export default function IncomingCallSheet() {
    const { incomingCall, clearIncomingCall, socket } = useApp()
    const navigate = useNavigate()
    const layer = typeof document !== 'undefined' ? document.getElementById('device-layer') : null

    if (!incomingCall || !layer) return null

    const accept = () => {
        const call = incomingCall
        clearIncomingCall()
        navigate(`/call/${call.chatId}`, {
            state: {
                role: 'callee',
                offer: call.offer,
                otherUserId: call.fromUserId,
                otherUserName: call.fromUserName,
            },
        })
    }

    const decline = () => {
        socket?.emit('call:decline', { toUserId: incomingCall.fromUserId })
        clearIncomingCall()
    }

    return createPortal(
        <div className="pointer-events-auto absolute inset-0 z-[60] flex flex-col justify-end bg-black/50 anim-in">
            <div className="bg-surface rounded-t-3xl px-6 pt-6 pb-8 flex flex-col items-center">
                <p className="text-xs text-muted mb-1">Incoming call</p>
                <Avatar name={incomingCall.fromUserName || 'Caller'} size="lg" />
                <h3 className="text-lg font-bold text-ink mt-3">{incomingCall.fromUserName || 'Unknown'}</h3>
                <div className="flex items-center gap-8 mt-6">
                    <button onClick={decline} className="tap h-14 w-14 rounded-full bg-red-500 text-white grid place-items-center">
                        <PhoneOff size={22} />
                    </button>
                    <button onClick={accept} className="tap h-14 w-14 rounded-full bg-brand text-white grid place-items-center">
                        <Phone size={22} />
                    </button>
                </div>
            </div>
        </div>,
        layer
    )
}