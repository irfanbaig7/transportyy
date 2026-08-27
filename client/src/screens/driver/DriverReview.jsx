import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, Stepper, StickyCTA, Avatar } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverReview() {
    const navigate = useNavigate()
    const { user, becomeDriver } = useApp()

    // Guard: if user data isn't loaded yet (or something's missing), don't crash.
    if (!user) {
        return (
            <Screen header={<TopBar title="Driver Sign Up" />}>
                <p className="text-sm text-muted mt-6">Loading your details…</p>
            </Screen>
        )
    }

    const goLive = async () => {
        try {
            await becomeDriver()
            navigate('/driver/dashboard')
        } catch (e) {
            // becomeDriver already logs via context error state; keep UX simple here.
            alert(e.message || 'Could not go live. Try again.')
        }
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
                <Avatar name={user.name || '?'} size="lg" />
                <div>
                    <p className="font-bold text-ink">{user.name || '—'}</p>
                    <p className="text-sm text-muted">{user.phone || '—'}</p>
                    <p className="text-sm text-muted">{user.city || 'City not set'}</p>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface">
                <p className="text-xs font-semibold text-muted mb-1">Car Details</p>
                {user.car?.brand ? (
                    <>
                        <p className="font-bold text-ink">{user.car.brand}</p>
                        <p className="text-sm text-muted">
                            {user.car.number || '—'} · {user.car.year || '—'} · {user.car.type || '—'}
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-muted">No car details added yet.</p>
                )}
            </div>
        </Screen>
    )
}