import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Smartphone, CreditCard, Wallet, ShieldCheck } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const METHODS = [
    { id: 'UPI', label: 'UPI', icon: Smartphone },
    { id: 'Card', label: 'Card', icon: CreditCard },
    { id: 'Wallet', label: 'Wallet', icon: Wallet },
]

export default function BookingPayment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { getRideById, bookRide } = useApp()
    const ride = getRideById(id)
    const seats = location.state?.seats || 1
    const [method, setMethod] = useState('UPI')

    if (!ride) return null
    const subtotal = ride.price * seats
    const fee = 20
    const total = subtotal + fee

    const confirm = () => {
        bookRide({ ride, seats, paymentMethod: method })
        navigate('/booking/processing')
    }

    return (
        <Screen
            header={<TopBar title="Booking & Payment" />}
            footer={<StickyCTA><Button full icon={ShieldCheck} onClick={confirm}>Confirm Booking</Button></StickyCTA>}
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine compact from={ride.from} to={ride.to} />
                <p className="text-xs text-muted mt-2">{ride.date} · {ride.time}</p>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <p className="text-sm font-bold text-ink mb-3">Price Details</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted">₹{ride.price} x {seats} Seat{seats > 1 ? 's' : ''}</span><span className="text-ink">₹{subtotal}</span></div>
                    <div className="flex justify-between"><span className="text-muted">Platform Fee</span><span className="text-ink">₹{fee}</span></div>
                    <div className="flex justify-between pt-2 border-t border-line font-bold text-ink"><span>Total</span><span>₹{total}</span></div>
                </div>
            </div>

            <p className="text-sm font-bold text-ink mb-2">Select Payment Method</p>
            <div className="space-y-2">
                {METHODS.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`tap w-full flex items-center gap-3 p-3.5 rounded-xl border ${method === m.id ? 'border-brand bg-brand-tint' : 'border-line bg-surface'
                            }`}
                    >
                        <m.icon size={18} className="text-ink" />
                        <span className="flex-1 text-left text-sm font-medium text-ink">{m.label}</span>
                        <span className={`h-4 w-4 rounded-full border-2 ${method === m.id ? 'border-brand bg-brand' : 'border-line'}`} />
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-muted mt-4">🔒 Secure & Safe Payments</p>
        </Screen>
    )
}