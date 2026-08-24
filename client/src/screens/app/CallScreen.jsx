import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Mic, MicOff, Volume2, PhoneOff } from 'lucide-react'
import { Avatar } from '../../components'
import { useApp } from '../../context/AppContext'

export default function CallScreen() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getChatById } = useApp()
    const chat = getChatById(id)
    const [muted, setMuted] = useState(false)
    const [speaker, setSpeaker] = useState(false)

    return (
        <div className="flex flex-col h-full bg-ink text-white px-6 pt-14 pb-10 items-center">
            <p className="text-sm opacity-70">Calling…</p>
            <Avatar name={chat?.with.name || 'Driver'} size="xl" className="mt-6" />
            <h1 className="text-xl font-bold mt-4">{chat?.with.name || 'Driver'}</h1>
            <p className="text-sm opacity-60 mt-1">00:12</p>
            <div className="flex-1" />
            <div className="flex items-center gap-6">
                <button onClick={() => setMuted((v) => !v)} className={`tap h-14 w-14 rounded-full grid place-items-center ${muted ? 'bg-white text-ink' : 'bg-white/15'}`}>
                    {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button onClick={() => navigate(-1)} className="tap h-16 w-16 rounded-full bg-red-500 grid place-items-center">
                    <PhoneOff size={26} />
                </button>
                <button onClick={() => setSpeaker((v) => !v)} className={`tap h-14 w-14 rounded-full grid place-items-center ${speaker ? 'bg-white text-ink' : 'bg-white/15'}`}>
                    <Volume2 size={22} />
                </button>
            </div>
        </div>
    )
}