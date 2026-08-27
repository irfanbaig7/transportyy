import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Input, Stepper, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverBasicInfo() {
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

  const next = async () => {
    setErr('')
    setSaving(true)
    try {
      await updateUser(form)
      navigate('/driver/car')
    } catch (e) {
      setErr(e.message || 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Screen
      header={<TopBar title="Driver Sign Up" />}
      footer={<StickyCTA><Button full onClick={next} disabled={saving}>{saving ? 'Saving…' : 'Next'}</Button></StickyCTA>}
    >
      <Stepper steps={STEPS} current={0} />
      <h2 className="text-xl font-extrabold mt-6">Tell us about yourself</h2>
      <p className="text-sm text-muted mt-1 mb-5">This helps passengers trust you.</p>
      <div className="space-y-4">
        <Input label="Full Name" icon={User} placeholder="Enter your full name" value={form.name} onChange={set('name')} />
        <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
        <Input label="Email" icon={Mail} type="email" placeholder="Enter your email" value={form.email} onChange={set('email')} />
        <Input label="City" icon={MapPin} placeholder="Enter your city" value={form.city} onChange={set('city')} />
        {err && <p className="text-xs font-medium text-red-500">{err}</p>}
      </div>
    </Screen>
  )
}