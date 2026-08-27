import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Screen, TopBar, Button, StickyCTA } from '../components'
import { api } from '../api/client'

export default function OtpVerify() {
    const [digits, setDigits] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const refs = useRef([])
    const navigate = useNavigate()
    const location = useLocation()
    const phone = location.state?.phone

    if (!phone) {
        return (
            <Screen header={<TopBar title="Verify OTP" />}>
                <p className="text-sm text-muted mt-6">
                    Please start from the Forgot Password screen so we know which number to verify.
                </p>
            </Screen>
        )
    }

    const update = (i, val) => {
        if (!/^\d*$/.test(val)) return
        const next = [...digits]
        next[i] = val.slice(-1)
        setDigits(next)
        if (val && i < 3) refs.current[i + 1]?.focus()
    }

    const submit = async () => {
        const otp = digits.join('')
        if (otp.length !== 4) {
            setErr('Enter the full 4-digit code.')
            return
        }
        setErr('')
        setLoading(true)
        try {
            await api.verifyOtp(phone, otp)
            navigate('/reset', { state: { phone, otp } })
        } catch (e) {
            setErr(e.message || 'Invalid or expired OTP.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Verify OTP" />}
            footer={
                <StickyCTA>
                    {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                    <Button full onClick={submit} disabled={loading}>{loading ? 'Verifying…' : 'Verify'}</Button>
                </StickyCTA>
            }
        >
            <p className="text-sm text-muted mb-6">Enter the 4-digit code sent to {phone}.</p>
            <div className="flex items-center justify-center gap-3 mb-6">
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        value={d}
                        onChange={(e) => update(i, e.target.value)}
                        maxLength={1}
                        inputMode="numeric"
                        className="h-14 w-14 rounded-xl border border-line bg-surface text-center text-xl font-bold text-ink focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none"
                    />
                ))}
            </div>
        </Screen>
    )
}