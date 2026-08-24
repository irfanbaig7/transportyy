import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, Stepper, StickyCTA, Avatar } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverReview() {
    const navigate = useNavigate()
    const { user, setRole, setAvailability } = useApp()

    const goLive = () => {
        setRole('driver')
        setAvailability(true)
        navigate('/driver/dashboard')
    }

    return (
        <Screen
            header={<TopBar title="Driver Sign Up" />}
            footer={<StickyCTA><Button full onClick={goLive}>Become Available</Button></StickyCTA>}
        >
            <Stepper steps={STEPS} current={3} />
            <h2 className="text-xl font-extrabold mt-6">Review & Go Live</h2>
            <p className="text-sm text-muted mt-1 mb-5">You're almost ready to start!</p>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-line bg-surface mb-3">
                <Avatar name={user.name} size="lg" />
                <div>
                    <p className="font-bold text-ink">{user.name}</p>
                    <p className="text-sm text-muted">{user.phone}</p>
                    <p className="text-sm text-muted">{user.city}</p>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface">
                <p className="text-xs font-semibold text-muted mb-1">Car Details</p>
                <p className="font-bold text-ink">{user.car.brand}</p>
                <p className="text-sm text-muted">{user.car.number} · {user.car.year} · {user.car.type}</p>
            </div>
        </Screen>
    )
}