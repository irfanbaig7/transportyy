import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../components'
import { api } from '../api/client'

export default function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation()
    const { phone, otp } = location.state || {}
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')

    if (!phone || !otp) {
        return (
            <Screen header={<TopBar title="Reset Password" />}>
                <p className="text-sm text-muted mt-6">
                    Please start from the Forgot Password screen to reset your password.
                </p>
            </Screen>
        )
    }

    const submit = async () => {
        if (password.length < 8) {
            setErr('Password must be at least 8 characters.')
            return
        }
        if (password !== confirm) {
            setErr('Passwords do not match.')
            return
        }
        setErr('')
        setLoading(true)
        try {
            await api.resetPassword(phone, otp, password)
            navigate('/login')
        } catch (e) {
            setErr(e.message || 'Could not reset password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Reset Password" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    <Button full onClick={submit} disabled={loading}>{loading ? 'Saving…' : 'Reset Password'}</Button>
                </StickyCTA>
            }
        >
            <p className="text-sm text-muted mb-6">Set a new password for your account.</p>
            <div className="space-y-4">
                <Input label="New Password" icon={Lock} type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input label="Confirm Password" icon={Lock} type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
        </Screen>
    )
}