import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Camera, Check } from 'lucide-react'
import { Screen, TopBar, Button, Stepper, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

// No real file storage wired yet — clicking a row just marks it "uploaded"
// and stores a placeholder URL. Swap this for real file upload (S3/Cloudinary)
// later; the backend field (updateDocuments) is already in place.
const ROWS = [
    { key: 'licenseUrl', label: 'Driving License', action: 'Upload Front', icon: FileText },
    { key: 'rcUrl', label: 'RC (Registration Certificate)', action: 'Upload', icon: FileText },
    { key: 'insuranceUrl', label: 'Car Insurance', action: 'Upload', icon: FileText },
    { key: 'photoUrl', label: 'Profile Photo', action: 'Upload', icon: Camera },
]

export default function DriverDocuments() {
    const navigate = useNavigate()
    const { user, updateDocuments } = useApp()
    const [docs, setDocs] = useState({
        licenseUrl: user?.documents?.licenseUrl || '',
        rcUrl: user?.documents?.rcUrl || '',
        insuranceUrl: user?.documents?.insuranceUrl || '',
        photoUrl: user?.documents?.photoUrl || '',
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')

    const markUploaded = (key) => setDocs((d) => ({ ...d, [key]: `uploaded-${key}-${Date.now()}` }))

    const next = async () => {
        setErr('')
        setSaving(true)
        try {
            await updateDocuments(docs)
            navigate('/driver/review')
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
            <Stepper steps={STEPS} current={2} />
            <h2 className="text-xl font-extrabold mt-6">Upload Documents</h2>
            <p className="text-sm text-muted mt-1 mb-5">Keep your documents updated.</p>
            <div className="space-y-3">
                {ROWS.map((r) => {
                    const done = !!docs[r.key]
                    return (
                        <div key={r.key} className="flex items-center justify-between p-4 rounded-xl border border-line bg-surface">
                            <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                                <r.icon size={18} className="text-muted" /> {r.label}
                            </span>
                            <button
                                onClick={() => markUploaded(r.key)}
                                className={`tap text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 ${done ? 'bg-brand text-white' : 'text-brand bg-brand-tint'
                                    }`}
                            >
                                {done && <Check size={12} />}
                                {done ? 'Uploaded' : r.action}
                            </button>
                        </div>
                    )
                })}
                {err && <p className="text-xs font-medium text-red-500">{err}</p>}
            </div>
        </Screen>
    )
}