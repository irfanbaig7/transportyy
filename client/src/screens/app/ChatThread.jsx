import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Phone, Send } from 'lucide-react'
import { Screen, TopBar, Avatar } from '../../components'
import { useApp } from '../../context/AppContext'

export default function ChatThread() {
    const { id } = useParams()
    const { getChatById, sendMessage } = useApp()
    const chat = getChatById(id)
    const [text, setText] = useState('')
    if (!chat) return null

    const submit = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        sendMessage(chat.id, text.trim())
        setText('')
    }

    return (
        <Screen
            header={
                <TopBar
                    title={chat.with.name}
                    subtitle={chat.with.online ? 'Online' : 'Offline'}
                    right={
                        <Link to={`/call/${chat.id}`} className="tap h-9 w-9 grid place-items-center rounded-full hover:bg-black/5">
                            <Phone size={18} className="text-ink" />
                        </Link>
                    }
                />
            }
            footer={
                <form onSubmit={submit} className="shrink-0 flex items-center gap-2 bg-surface border-t border-line px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message…"
                        className="flex-1 h-11 px-4 rounded-full border border-line bg-canvas text-sm text-ink outline-none focus:border-brand"
                    />
                    <button type="submit" className="tap h-11 w-11 rounded-full bg-brand text-white grid place-items-center shrink-0">
                        <Send size={17} />
                    </button>
                </form>
            }
        >
            <div className="flex flex-col gap-2.5">
                {chat.messages.map((m) => (
                    <div key={m.id} className={`max-w-[75%] ${m.from === 'me' ? 'ml-auto items-end' : ''} flex flex-col`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${m.from === 'me' ? 'bg-brand text-white rounded-br-md' : 'bg-surface border border-line text-ink rounded-bl-md'}`}>
                            {m.text}
                        </div>
                        <span className="text-[10px] text-muted mt-1">{m.time}</span>
                    </div>
                ))}
            </div>
        </Screen>
    )
}