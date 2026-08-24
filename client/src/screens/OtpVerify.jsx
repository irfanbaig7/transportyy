import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, StickyCTA } from '../components'

export default function OtpVerify() {
    const [digits, setDigits] = useState(['', '', '', ''])
    const refs = useRef([])
    const navigate = useNavigate()

    const update = (i, val) => {
        if (!/^\d*$/.test(val)) return
        const next = [...digits]
        next[i] = val.slice(-1)
        setDigits(next)
        if (val && i < 3) refs.current[i + 1]?.focus()
    }

    return (
        <Screen
            header={<TopBar title="Verify OTP" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/reset')}>Verify</Button></StickyCTA>}
        >
            <p className="text-sm text-muted mb-6">Enter the 4-digit code sent to your mobile number.</p>
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
            <p className="text-center text-sm text-muted">
                Didn't get the code?{' '}
                <button className="tap font-semibold text-brand">Resend</button>
            </p>
        </Screen>
    )
}