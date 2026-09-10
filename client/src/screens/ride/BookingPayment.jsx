import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Smartphone, CreditCard, Wallet, ShieldCheck } from 'lucide-react'
import { Screen, TopBar, Button, RouteLine, StickyCTA, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'
import { api } from '../../api/client'

const METHODS = [
    { id: 'UPI', label: 'UPI', icon: Smartphone },
    { id: 'Card', label: 'Card', icon: CreditCard },
    { id: 'Wallet', label: 'Wallet', icon: Wallet },
]

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true)
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default function BookingPayment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { getRideById, bookRide, user } = useApp()

    const [ride, setRide] = useState(() => getRideById(id) || null)
    const [loading, setLoading] = useState(!ride)
    const [method, setMethod] = useState('UPI')
    const [confirming, setConfirming] = useState(false)
    const [err, setErr] = useState('')

    const seats = location.state?.seats || 1

    useEffect(() => {
        if (ride) return
        setLoading(true)
        api.getRide(id)
            .then((d) => setRide(d.ride))
            .catch(() => setRide(null))
            .finally(() => setLoading(false))
    }, [id, ride])

    if (loading) {
        return (
            <Screen header={<TopBar title="Booking & Payment" />}>
                <div className="flex justify-center py-16"><Spinner size={30} /></div>
            </Screen>
        )
    }

    if (!ride) {
        return (
            <Screen header={<TopBar title="Booking & Payment" />}>
                <p className="text-sm text-muted mt-6">This ride couldn't be found. It may have been removed.</p>
            </Screen>
        )
    }

    const subtotal = ride.price * seats
    const fee = 20
    const total = subtotal + fee

    const confirm = async () => {
        setErr('')
        setConfirming(true)
        try {
            const token = localStorage.getItem('chalo_token')

            // 1) Backend se payment order banwao
            const orderRes = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rideId: ride._id || ride.id, seats }),
            })
            const orderData = await orderRes.json()

            // Agar payments configure nahi hain (dev mode), seedha booking bana do
            if (orderRes.status === 503) {
                await bookRide({ ride, seats, paymentMethod: method })
                navigate('/booking/processing')
                return
            }
            if (!orderRes.ok) throw new Error(orderData.error || 'Could not start payment.')

            // 2) Razorpay checkout script load karo aur open karo
            const loaded = await loadRazorpayScript()
            if (!loaded) throw new Error('Could not load payment gateway. Check your internet.')

            const options = {
                key: orderData.keyId,
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Chalo',
                description: `${ride.from} → ${ride.to}`,
                order_id: orderData.order.id,
                prefill: { name: user?.name, contact: user?.phone },
                theme: { color: '#12a150' },
                handler: async (response) => {
                    try {
                        // 3) Signature verify karwao
                        const verifyRes = await fetch('/api/payments/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            }),
                        })
                        const verifyData = await verifyRes.json()
                        if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.')

                        // 4) Ab booking finalize karo, payment proof ke saath
                        const bookRes = await fetch('/api/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({
                                rideId: ride._id || ride.id,
                                seats,
                                paymentMethod: method,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                            }),
                        })
                        const bookData = await bookRes.json()
                        if (!bookRes.ok) throw new Error(bookData.error || 'Booking failed after payment.')

                        navigate('/booking/processing')
                    } catch (e) {
                        setErr(e.message || 'Something went wrong after payment.')
                        navigate('/booking/failed')
                    } finally {
                        setConfirming(false)
                    }
                },
                modal: {
                    ondismiss: () => setConfirming(false),
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', () => {
                setConfirming(false)
                navigate('/booking/failed')
            })
            rzp.open()
        } catch (e) {
            setErr(e.message || 'Booking failed. Try again.')
            setConfirming(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Booking & Payment" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    <Button full icon={ShieldCheck} onClick={confirm} disabled={confirming}>
                        {confirming ? 'Processing…' : 'Confirm & Pay'}
                    </Button>
                </StickyCTA>
            }
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <RouteLine compact from={ride.from} to={ride.to} />
                <p className="text-xs text-muted mt-2">{ride.date} · {ride.time}</p>
            </div>

            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                <p className="text-sm font-bold text-ink mb-3">Price Details</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted">₹{ride.price} x {seats} Seat{seats > 1 ? 's' : ''}</span>
                        <span className="text-ink">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted">Platform Fee</span>
                        <span className="text-ink">₹{fee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-line font-bold text-ink">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
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
            <p className="text-center text-xs text-muted mt-4">🔒 Secure & Safe Payments via Razorpay</p>
        </Screen>
    )
}