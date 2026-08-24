import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, Lock } from 'lucide-react'
import { Button, Input } from '../components'
import { useApp } from '../context/AppContext'

export default function CreateAccount() {
    const navigate = useNavigate()
    const { signup, loading } = useApp()
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
    const [err, setErr] = useState('')

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setErr('')
        try {
            await signup(form)
            navigate('/home')
        } catch (e) {
            setErr(e.message || 'Signup failed.')
        }
    }

    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-6 overflow-y-auto no-scrollbar">
            <h1 className="text-2xl font-extrabold">Create Account</h1>
            <p className="mt-1 text-sm text-muted">Join the open ride community</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <Input label="Full Name" icon={User} placeholder="Enter your full name" value={form.name} onChange={set('name')} />
                <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                <Input label="Email" icon={Mail} type="email" placeholder="Enter your email" optional value={form.email} onChange={set('email')} />
                <Input label="Password" icon={Lock} type="password" placeholder="Create a password" value={form.password} onChange={set('password')} />
                {err && <p className="text-xs font-medium text-red-500">{err}</p>}
                <Button full type="submit" className="mt-1" disabled={loading}>{loading ? 'Creating…' : 'Sign Up'}</Button>
            </form>

            <p className="text-center text-sm text-muted mt-5">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="tap font-semibold text-brand">Log In</button>
            </p>
        </div>
    )
}