import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Hash, Calendar } from 'lucide-react'
import { Screen, TopBar, Button, Input, Stepper, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverCarDetails() {
    const navigate = useNavigate()
    const { user, updateDriverProfile } = useApp()
    const [form, setForm] = useState({
        brand: user?.car?.brand || '',
        number: user?.car?.number || '',
        type: user?.car?.type || '4 Wheeler',
        year: user?.car?.year || '',
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

    const next = async () => {
        setErr('')
        setSaving(true)
        try {
            await updateDriverProfile({ car: form })
            navigate('/driver/documents')
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
            <Stepper steps={STEPS} current={1} />
            <h2 className="text-xl font-extrabold mt-6">Add your car details</h2>
            <p className="text-sm text-muted mt-1 mb-5">Provide accurate info for safety.</p>
            <div className="space-y-4">
                <Input label="Car Brand & Model" icon={Car} placeholder="e.g. Honda City" value={form.brand} onChange={set('brand')} />
                <Input label="Car Number" icon={Hash} placeholder="e.g. MH12 AB 1234" value={form.number} onChange={set('number')} />
                <label className="block">
                    <span className="mb-1.5 block text-[13px] font-medium text-ink">Car Type</span>
                    <select
                        value={form.type}
                        onChange={set('type')}
                        className="w-full h-12 px-3.5 rounded-xl border border-line bg-surface text-[15px] text-ink outline-none focus:border-brand"
                    >
                        <option>4 Wheeler</option>
                        <option>3 Wheeler</option>
                        <option>2 Wheeler</option>
                    </select>
                </label>
                <Input label="Year of Manufacture" icon={Calendar} placeholder="e.g. 2020" value={form.year} onChange={set('year')} />
                {err && <p className="text-xs font-medium text-red-500">{err}</p>}
            </div>
        </Screen>
    )
}