import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../components'

export default function ForgotPassword() {
    const navigate = useNavigate()
    return (
        <Screen
            header={<TopBar title="Forgot Password" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/otp')}>Send OTP</Button></StickyCTA>}
        >
            <p className="text-sm text-muted mb-6">Enter your registered mobile number, we'll send you a code to reset your password.</p>
            <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" />
        </Screen>
    )
}