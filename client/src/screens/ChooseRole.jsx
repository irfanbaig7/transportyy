import { useNavigate } from 'react-router-dom'
import { Users, Car } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ChooseRole() {
    const navigate = useNavigate()
    const { setRole } = useApp()

    const pick = (role) => {
        setRole(role)
        navigate('/get-started')
    }

    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold">How would you like<br />to join?</h1>
                <p className="mt-2 text-sm text-muted">You can switch anytime later.</p>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-4">
                <RoleCard icon={Users} title="I'm a Passenger" subtitle="I want to find & book" onClick={() => pick('passenger')} />
                <RoleCard icon={Car} title="I'm a Driver" subtitle="I want to offer my ride" onClick={() => pick('driver')} />
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-6">
                {[0, 1, 2].map((d) => (
                    <span key={d} className={`h-1.5 rounded-full ${d === 1 ? 'w-6 bg-brand' : 'w-1.5 bg-line'}`} />
                ))}
            </div>
        </div>
    )
}

function RoleCard({ icon: Icon, title, subtitle, onClick }) {
    return (
        <button onClick={onClick} className="tap flex items-center gap-4 p-5 rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] active:scale-[0.98] transition text-left">
            <span className="h-14 w-14 rounded-2xl bg-brand-tint grid place-items-center shrink-0">
                <Icon size={26} className="text-brand" />
            </span>
            <span>
                <span className="block font-bold text-ink">{title}</span>
                <span className="block text-sm text-muted">{subtitle}</span>
            </span>
        </button>
    )
}