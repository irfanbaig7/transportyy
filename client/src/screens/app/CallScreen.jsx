import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Volume2, PhoneOff } from 'lucide-react'
import { Avatar } from '../../components'
import { useApp } from '../../context/AppContext'

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

export default function CallScreen() {
    const { id: chatId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { socket } = useApp()

    const role = location.state?.role || 'caller'
    const otherUserId = location.state?.otherUserId
    const otherUserName = location.state?.otherUserName || 'User'
    const incomingOffer = location.state?.offer

    const [status, setStatus] = useState(role === 'caller' ? 'Calling…' : 'Connecting…')
    const [muted, setMuted] = useState(false)
    const [speaker, setSpeaker] = useState(false)
    const [seconds, setSeconds] = useState(0)

    const pcRef = useRef(null)
    const localStreamRef = useRef(null)
    const remoteAudioRef = useRef(null)
    const timerRef = useRef(null)
    const endedRef = useRef(false)

    useEffect(() => {
        if (!socket || !otherUserId) {
            navigate(-1)
            return
        }

        let cancelled = false

        const cleanup = () => {
            if (timerRef.current) clearInterval(timerRef.current)
            localStreamRef.current?.getTracks().forEach((t) => t.stop())
            pcRef.current?.close()
            pcRef.current = null
        }

        const startTimer = () => {
            if (timerRef.current) return
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
        }

        const setup = async () => {
            const pc = new RTCPeerConnection(ICE_SERVERS)
            pcRef.current = pc

            pc.onicecandidate = (e) => {
                if (e.candidate) socket.emit('call:ice-candidate', { toUserId: otherUserId, candidate: e.candidate })
            }
            pc.ontrack = (e) => {
                if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0]
            }
            pc.onconnectionstatechange = () => {
                if (pc.connectionState === 'connected') {
                    setStatus('Connected')
                    startTimer()
                }
                if (['disconnected', 'failed', 'closed'].includes(pc.connectionState) && !endedRef.current) {
                    endedRef.current = true
                    cleanup()
                    navigate(-1)
                }
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                if (cancelled) return
                localStreamRef.current = stream
                stream.getTracks().forEach((t) => pc.addTrack(t, stream))
            } catch {
                setStatus('Microphone access denied')
                return
            }

            if (role === 'caller') {
                const offer = await pc.createOffer()
                await pc.setLocalDescription(offer)
                socket.emit('call:offer', { toUserId: otherUserId, chatId, offer })
            } else if (incomingOffer) {
                await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer))
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                socket.emit('call:answer', { toUserId: otherUserId, answer })
            }
        }

        const onAnswer = ({ answer, fromUserId }) => {
            if (fromUserId !== otherUserId || !pcRef.current) return
            pcRef.current.setRemoteDescription(new RTCSessionDescription(answer))
        }
        const onIce = ({ candidate, fromUserId }) => {
            if (fromUserId !== otherUserId || !pcRef.current) return
            pcRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => { })
        }
        const onEnded = ({ fromUserId }) => {
            if (fromUserId !== otherUserId || endedRef.current) return
            endedRef.current = true
            setStatus('Call ended')
            cleanup()
            setTimeout(() => navigate(-1), 700)
        }
        const onDeclined = ({ fromUserId }) => {
            if (fromUserId !== otherUserId) return
            endedRef.current = true
            setStatus('Call declined')
            cleanup()
            setTimeout(() => navigate(-1), 900)
        }

        socket.on('call:answer', onAnswer)
        socket.on('call:ice-candidate', onIce)
        socket.on('call:ended', onEnded)
        socket.on('call:declined', onDeclined)

        setup()

        return () => {
            cancelled = true
            socket.off('call:answer', onAnswer)
            socket.off('call:ice-candidate', onIce)
            socket.off('call:ended', onEnded)
            socket.off('call:declined', onDeclined)
            if (!endedRef.current) cleanup()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, otherUserId])

    const toggleMute = () => {
        const next = !muted
        setMuted(next)
        localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next))
    }

    const hangUp = () => {
        if (!endedRef.current) {
            endedRef.current = true
            socket?.emit('call:end', { toUserId: otherUserId })
        }
        if (timerRef.current) clearInterval(timerRef.current)
        localStreamRef.current?.getTracks().forEach((t) => t.stop())
        pcRef.current?.close()
        navigate(-1)
    }

    const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
    const ss = String(seconds % 60).padStart(2, '0')

    return (
        <div className="flex flex-col h-full bg-neutral-950 text-white px-6 pt-14 pb-10 items-center">
            <audio ref={remoteAudioRef} autoPlay playsInline />
            <p className="text-sm opacity-70">{status}</p>
            <Avatar name={otherUserName} size="xl" className="mt-6" />
            <h1 className="text-xl font-bold mt-4">{otherUserName}</h1>
            <p className="text-sm opacity-60 mt-1">{status === 'Connected' ? `${mm}:${ss}` : ' '}</p>
            <div className="flex-1" />
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleMute}
                    className={`tap h-14 w-14 rounded-full grid place-items-center ${muted ? 'bg-white text-ink' : 'bg-white/15'}`}
                >
                    {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button onClick={hangUp} className="tap h-16 w-16 rounded-full bg-red-500 grid place-items-center">
                    <PhoneOff size={26} />
                </button>
                <button
                    onClick={() => setSpeaker((v) => !v)}
                    className={`tap h-14 w-14 rounded-full grid place-items-center ${speaker ? 'bg-white text-ink' : 'bg-white/15'}`}
                >
                    <Volume2 size={22} />
                </button>
            </div>
        </div>
    )
}