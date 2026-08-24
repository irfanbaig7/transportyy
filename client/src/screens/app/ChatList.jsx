import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Screen, TopBar, Avatar, EmptyState } from '../../components'
import { useApp } from '../../context/AppContext'

export default function ChatList() {
    const { chats } = useApp()

    if (!chats.length) {
        return (
            <Screen header={<TopBar title="Messages" back={false} />}>
                <EmptyState icon={MessageCircle} title="No messages yet" message="Your conversations with drivers & passengers will show here." />
            </Screen>
        )
    }

    return (
        <Screen header={<TopBar title="Messages" back={false} />} padded={false}>
            <div className="divide-y divide-line">
                {chats.map((c) => (
                    <Link key={c.id} to={`/chat/${c.id}`} className="tap flex items-center gap-3 px-5 py-3.5">
                        <Avatar name={c.with.name} size="md" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink truncate">{c.with.name}</p>
                            <p className="text-xs text-muted truncate">{c.lastMessage}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-muted">{c.lastTime}</span>
                            {c.unread > 0 && (
                                <span className="h-4 min-w-4 px-1 rounded-full bg-brand text-white text-[9px] font-bold grid place-items-center">{c.unread}</span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </Screen>
    )
}