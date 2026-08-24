import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const REASONS = ['Plan changed', 'Found another ride', 'Driver unresponsive', 'Price too high', 'Other']

export default function CancelBooking() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { cancelBooking } = useApp()
    const [reason, setReason] = useState(REASONS[0])

    const confirm = () => {
        cancelBooking(id, reason)
        navigate('/trips')
    }

    return (
        <Screen
            header={<TopBar title="Cancel Booking" />}
            footer={<StickyCTA><Button full variant="danger" onClick={confirm}>Confirm Cancellation</Button></StickyCTA>}
        >
            <p className="text-sm text-muted mb-5">Please tell us why you're cancelling this trip.</p>
            <div className="space-y-2">
                {REASONS.map((r) => (
                    <button
                        key={r}
                        onClick={() => setReason(r)}
                        className={`tap w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium ${reason === r ? 'border-brand bg-brand-tint text-brand-darker' : 'border-line bg-surface text-ink'
                            }`}
                    >
                        {r}
                        <span className={`h-4 w-4 rounded-full border-2 ${reason === r ? 'border-brand bg-brand' : 'border-line'}`} />
                    </button>
                ))}
            </div>
        </Screen>
    )
}