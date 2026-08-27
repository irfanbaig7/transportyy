import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Input, Avatar, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function EditProfile() {
    const navigate = useNavigate()
    const { user, updateUser } = useApp()
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        city: user?.city || '',
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setErr('')
        setSaving(true)
        try {
            await updateUser(form)
            navigate('/profile')
        } catch (e2) {
            setErr(e2.message || 'Could not save changes.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Screen
            header={<TopBar title="Edit Profile" />}
            footer={<StickyCTA>
                {err && <p className="text-xs font-medium text-red-500 mb-2">{err}</p>}
                <Button full onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
            </StickyCTA>}
        >
            <div className="flex justify-center mb-6">
                <Avatar name={form.name || user?.name || '?'} size="xl" />
            </div>
            <form onSubmit={submit} className="space-y-4">
                <Input label="Full Name" icon={User} value={form.name} onChange={set('name')} />
                <Input label="Mobile Number" icon={Phone} value={form.phone} onChange={set('phone')} />
                <Input label="Email" icon={Mail} value={form.email} onChange={set('email')} optional />
                <Input label="City" icon={MapPin} value={form.city} onChange={set('city')} />
            </form>
        </Screen>
    )
}