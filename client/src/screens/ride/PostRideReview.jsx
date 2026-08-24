import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, RouteLine, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function PostRideReview() {
    const navigate = useNavigate()
    const { rideDraft, postRide } = useApp()

    const submit = () => {
        postRide(rideDraft)
        navigate('/post/success')
    }

    return (
        <Screen
            header={<TopBar title="Review your ride" subtitle="Check details before publishing." />}
            footer={<StickyCTA><Button full onClick={submit}>Post Ride</Button></StickyCTA>}
        >
            <div className="rounded-2xl bg-surface border border-line p-4 shadow-[var(--shadow-card)] space-y-4">
                <RouteLine from={rideDraft.from} to={rideDraft.to} via={rideDraft.via} />
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line text-sm">
                    <Row label="Date" value={rideDraft.date} />
                    <Row label="Time" value={rideDraft.time} />
                    <Row label="Seats" value={`${rideDraft.seats} Seats`} />
                    <Row label="Price per Seat" value={`₹${rideDraft.price}`} />
                </div>
            </div>
        </Screen>
    )
}

function Row({ label, value }) {
    return (
        <div>
            <p className="text-xs text-muted">{label}</p>
            <p className="font-semibold text-ink">{value}</p>
        </div>
    )
}