import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components'

export default function Login() {
    const [showPw, setShowPw] = useState(false)
    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        navigate('/home')
    }

    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
            <h1 className="text-2xl font-extrabold">Welcome Back!</h1>
            <p className="mt-1 text-sm text-muted">Log in to continue</p>

            <form onSubmit={submit} className="mt-7 space-y-4 flex-1">
                <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" />
                <div>
                    <Input
                        label="Password"
                        icon={Lock}
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        right={
                            <button type="button" onClick={() => setShowPw((v) => !v)} className="tap text-muted">
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        }
                    />
                    <div className="text-right mt-1.5">
                        <button type="button" onClick={() => navigate('/forgot')} className="tap text-xs font-semibold text-brand">
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <Button full type="submit" className="mt-2">Log In</Button>
            </form>

            <div className="mt-2">
                <div className="flex items-center gap-3 my-4">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-xs text-muted">or continue with</span>
                    <span className="h-px flex-1 bg-line" />
                </div>
                <div className="flex items-center justify-center gap-3">
                    {['G', 'f', '🍎'].map((l, idx) => (
                        <span key={idx} className="h-12 w-12 rounded-xl border border-line grid place-items-center font-bold text-ink">{l}</span>
                    ))}
                </div>
            </div>
            <p className="text-center text-sm text-muted mt-5">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="tap font-semibold text-brand">Sign Up</button>
            </p>
        </div>
    )
}