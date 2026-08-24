import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, Lock } from 'lucide-react'
import { Button, Input } from '../components'

export default function CreateAccount() {
    const navigate = useNavigate()
    const submit = (e) => {
        e.preventDefault()
        navigate('/home')
    }
    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
            <h1 className="text-2xl font-extrabold">Create Account</h1>
            <p className="mt-1 text-sm text-muted">Join the open ride community</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Input label="Full Name" icon={User} placeholder="Enter your full name" />
                <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" />
                <Input label="Email" icon={Mail} type="email" placeholder="Enter your email" optional />
                <Input label="Password" icon={Lock} type="password" placeholder="Create a password" />
                <Button full type="submit" className="mt-1">Sign Up</Button>
            </form>

            <div className="mt-5">
                <div className="flex items-center gap-3 mb-4">
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
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="tap font-semibold text-brand">Log In</button>
            </p>
        </div>
    )
}