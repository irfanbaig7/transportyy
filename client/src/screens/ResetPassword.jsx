import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../components'

export default function ResetPassword() {
    const navigate = useNavigate()
    return (
        <Screen
            header={<TopBar title="Reset Password" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/login')}>Reset Password</Button></StickyCTA>}
        >
            <p className="text-sm text-muted mb-6">Set a new password for your account.</p>
            <div className="space-y-4">
                <Input label="New Password" icon={Lock} type="password" placeholder="••••••••" />
                <Input label="Confirm Password" icon={Lock} type="password" placeholder="••••••••" />
            </div>
        </Screen>
    )
}