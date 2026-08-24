import { CheckCircle2, Phone, MessageCircle } from 'lucide-react'
import { Button, Avatar, RouteLine } from '../../components'
import { useApp } from '../../context/AppContext'

export default function BookingConfirmed() {
    const { lastBooking } = useApp()
    const t = lastBooking

    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
            <div className="flex flex-col items-center text-center mb-6">
                <span className="h-16 w-16 rounded-full bg-brand-light grid place-items-center mb-4">
                    <CheckCircle2 size={36} className="text-brand" />
                </span>
                <h1 className="text-xl font-extrabold text-ink">Booking Confirmed!</h1>
                <p className="text-sm text-muted mt-1">Your seat has been booked.</p>
            </div>

            {t && (
                <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar name={t.driver.name} size="md" />
                        <div className="flex-1">
                            <p className="font-semibold text-ink">{t.driver.name} ★ {t.driver.rating}</p>
                            <p className="text-xs text-muted">{t.car.brand} · {t.car.number}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><Phone size={16} className="text-brand" /></button>
                            <button className="tap h-9 w-9 rounded-full bg-brand-tint grid place-items-center"><MessageCircle size={16} className="text-brand" /></button>
                        </div>
                    </div>
                    <RouteLine compact from={t.from} to={t.to} />
                    <p className="text-xs text-muted mt-2">{t.date} · {t.time} · Seat {t.seats} · Total Paid ₹{t.total}</p>
                </div>
            )}

            <div className="flex-1" />
            <Button full to="/trips">View My Trips</Button>
        </div>
    )
}