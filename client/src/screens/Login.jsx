import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '../components'
import { useApp } from '../context/AppContext'

export default function Login() {
    const [showPw, setShowPw] = useState(false)
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    const { login, loading } = useApp()

    const submit = async (e) => {
        e.preventDefault()
        setErr('')
        try {
            await login({ phone, password })
            navigate('/home')
        } catch (e) {
            setErr(e.message || 'Login failed.')
        }
    }

    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
            <h1 className="text-2xl font-extrabold">Welcome Back!</h1>
            <p className="mt-1 text-sm text-muted">Log in to continue</p>

            <form onSubmit={submit} className="mt-7 space-y-4 flex-1">
                <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div>
                    <Input
                        label="Password"
                        icon={Lock}
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                {err && <p className="text-xs font-medium text-red-500">{err}</p>}
                <Button full type="submit" className="mt-2" disabled={loading}>{loading ? 'Logging in…' : 'Log In'}</Button>
            </form>

            <p className="text-center text-sm text-muted mt-5">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="tap font-semibold text-brand">Sign Up</button>
            </p>
        </div>
    )
}