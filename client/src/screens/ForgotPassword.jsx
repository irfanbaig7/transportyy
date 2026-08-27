import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../components'
import { api } from '../api/client'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')

    const submit = async () => {
        if (!/^\d{10}$/.test(phone.trim())) {
            setErr('Enter a valid 10-digit mobile number.')
            return
        }
        setErr('')
        setLoading(true)
        try {
            await api.forgotPassword(phone.trim())
            navigate('/otp', { state: { phone: phone.trim() } })
        } catch (e) {
            setErr(e.message || 'Could not send OTP.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Forgot Password" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    <Button full onClick={submit} disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</Button>
                </StickyCTA>
            }
        >
            <p className="text-sm text-muted mb-6">Enter your registered mobile number, we'll send you a code to reset your password.</p>
            <Input label="Mobile Number" icon={Phone} type="tel" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
        </Screen>
    )
}