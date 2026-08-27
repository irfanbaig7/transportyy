import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Screen, TopBar, Button, Avatar, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function RateReview() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getTripById, rateTrip } = useApp()
    const t = getTripById(id)
    const [rating, setRating] = useState(5)
    const [text, setText] = useState('')
    if (!t) return null

    const driver = t.driver || {}
    const from = t.from || t.ride?.from || '—'
    const to = t.to || t.ride?.to || '—'

    const submit = () => {
        rateTrip(t._id || t.id, rating, text)
        navigate('/trips')
    }

    return (
        <Screen
            header={<TopBar title="Rate your Trip" />}
            footer={<StickyCTA><Button full onClick={submit}>Submit Review</Button></StickyCTA>}
        >
            <div className="flex flex-col items-center text-center mb-6">
                <Avatar name={driver.name || 'Driver'} size="xl" />
                <p className="font-bold text-ink mt-3">{driver.name || 'Driver'}</p>
                <p className="text-xs text-muted">{from} → {to}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)} className="tap">
                        <Star size={32} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-line'} />
                    </button>
                ))}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience (optional)"
                rows={4}
                className="w-full p-3.5 rounded-xl border border-line bg-surface text-sm text-ink outline-none focus:border-brand resize-none"
            />
        </Screen>
    )
}