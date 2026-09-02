import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Phone, Send } from 'lucide-react'
import { Screen, TopBar, Avatar, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'

function dayLabel(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  const sameDay = (a, b) => a.toDateString() === b.toDateString()
  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ChatThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  // const { getChatById, sendMessage, markChatRead, user } = useApp() 
  const { getChatById, sendMessage, markChatRead, user, refreshChats } = useApp()
  const chat = getChatById(id)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    markChatRead(id)
  }, [id, markChatRead])

  useEffect(() => {
    if (!chat) {
      refreshChats()
    }
  }, [chat, id, refreshChats])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    markChatRead(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.messages?.length])

  // Wait for both the chat AND the logged-in user to be loaded before
  // rendering messages — otherwise "mine vs theirs" can't be decided correctly.
  if (!chat || !user) {
    return (
      <Screen header={<TopBar title="Chat" />}>
        <div className="flex justify-center py-16"><Spinner size={26} /></div>
      </Screen>
    )
  }

  const myId = String(user._id)
  const other = (chat.participants || []).find((p) => String(p._id || p) !== myId) || {}
  const otherName = other.name || 'User'
  const otherId = String(other._id || other || '')

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await sendMessage(chat._id || chat.id, text.trim())
      setText('')
    } finally {
      setSending(false)
    }
  }

  const goCall = () => {
    navigate(`/call/${chat._id || chat.id}`, { state: { role: 'caller', otherUserId: otherId, otherUserName: otherName } })
  }

  const messages = chat.messages || []
  let lastDay = null

  return (
    <Screen
      header={
        <TopBar
          title={otherName}
          right={
            <button onClick={goCall} className="tap h-9 w-9 grid place-items-center rounded-full hover:bg-black/5">
              <Phone size={18} className="text-ink" />
            </button>
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
          <button type="submit" disabled={sending || !text.trim()} className="tap h-11 w-11 rounded-full bg-brand text-white grid place-items-center shrink-0 disabled:opacity-50">
            <Send size={17} />
          </button>
        </form>
      }
    >
      <div className="flex flex-col gap-1">
        {messages.map((m) => {
          const senderId = String(m.sender?._id || m.sender)
          const mine = senderId === myId
          const createdAt = m.createdAt
          const showDaySeparator = createdAt && dayLabel(createdAt) !== lastDay
          if (createdAt) lastDay = dayLabel(createdAt)

          return (
            <div key={m._id || m.id} className="flex flex-col">
              {showDaySeparator && (
                <div className="flex justify-center my-3">
                  <span className="text-[10px] font-semibold text-muted bg-surface border border-line px-2.5 py-1 rounded-full">
                    {dayLabel(createdAt)}
                  </span>
                </div>
              )}
              <div className={`flex items-end gap-2 mb-1.5 ${mine ? 'flex-row-reverse' : ''}`}>
                {!mine && <Avatar name={otherName} size="xs" />}
                <div className={`max-w-[72%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm ${mine ? 'bg-brand text-white rounded-br-md' : 'bg-surface border border-line text-ink rounded-bl-md'
                      }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-muted mt-1">
                    {createdAt
                      ? new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : m.time}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </Screen>
  )
}