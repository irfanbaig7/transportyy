import { useEffect, useState } from 'react'
import { Screen, TopBar, Spinner } from '../../components'
import { api } from '../../api/client'
import { TrendingUp } from 'lucide-react'

export default function Earnings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.driverEarnings()
            .then((d) => setBookings(d.bookings || []))
            .catch(() => setBookings([]))
            .finally(() => setLoading(false))
    }, [])

    // What the driver actually receives — seat price x seats. The platform fee
    // the passenger paid on top goes to the platform, not the driver.
    const total = bookings.reduce((sum, b) => sum + (b.pricePerSeat || 0) * (b.seats || 0), 0)

    return (
        <Screen header={<TopBar title="Earnings" />}>
            <div className="rounded-2xl bg-brand text-white p-5 mb-5">
                <p className="text-sm opacity-90 flex items-center gap-1.5"><TrendingUp size={16} /> Total Earnings</p>
                <p className="text-3xl font-extrabold mt-1">₹{total}</p>
                <p className="text-xs opacity-80 mt-1">{bookings.length} completed trip{bookings.length === 1 ? '' : 's'}</p>
            </div>
            <p className="text-sm font-bold text-ink mb-2">Trip History</p>
            {loading ? (
                <div className="flex justify-center py-10"><Spinner size={26} /></div>
            ) : bookings.length ? (
                <div className="space-y-3">
                    {bookings.map((b) => (
                        <div key={b._id} className="flex items-center justify-between rounded-xl border border-line bg-surface p-4">
                            <div>
                                <p className="font-semibold text-ink text-sm">{b.ride?.from || '—'} → {b.ride?.to || '—'}</p>
                                <p className="text-xs text-muted">{b.ride?.date || ''} · {b.passenger?.name || 'Passenger'}</p>
                            </div>
                            <p className="font-bold text-ink">₹{(b.pricePerSeat || 0) * (b.seats || 0)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted">No completed trips yet.</p>
            )}
        </Screen>
    )
}