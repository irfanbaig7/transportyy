import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Camera, Check, Loader2 } from 'lucide-react'
import { Screen, TopBar, Button, Stepper, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

const ROWS = [
    { key: 'licenseUrl', label: 'Driving License', action: 'Upload Front', icon: FileText, docType: 'license' },
    { key: 'rcUrl', label: 'RC (Registration Certificate)', action: 'Upload', icon: FileText, docType: 'rc' },
    { key: 'insuranceUrl', label: 'Car Insurance', action: 'Upload', icon: FileText, docType: 'insurance' },
    { key: 'photoUrl', label: 'Profile Photo', action: 'Upload', icon: Camera, docType: 'photo' },
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
    const [uploading, setUploading] = useState('') // jo key upload ho raha hai uska naam
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState('')
    const fileInputs = useRef({})

    const triggerUpload = (key) => fileInputs.current[key]?.click()

    const handleFileChange = async (row, e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setErr('')
        setUploading(row.key)
        try {
            const token = localStorage.getItem('chalo_token')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('docType', row.docType)

            const res = await fetch('/api/upload/document', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')

            setDocs((d) => ({ ...d, [row.key]: data.url }))
        } catch (e2) {
            setErr(e2.message || 'Could not upload file.')
        } finally {
            setUploading('')
        }
    }

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
                    const isUploading = uploading === r.key
                    return (
                        <div key={r.key} className="flex items-center justify-between p-4 rounded-xl border border-line bg-surface">
                            <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                                <r.icon size={18} className="text-muted" /> {r.label}
                            </span>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                ref={(el) => (fileInputs.current[r.key] = el)}
                                onChange={(e) => handleFileChange(r, e)}
                                className="hidden"
                            />
                            <button
                                onClick={() => triggerUpload(r.key)}
                                disabled={isUploading}
                                className={`tap text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 ${done ? 'bg-brand text-white' : 'text-brand bg-brand-tint'
                                    }`}
                            >
                                {isUploading ? <Loader2 size={12} className="animate-spin" /> : done && <Check size={12} />}
                                {isUploading ? 'Uploading…' : done ? 'Uploaded' : r.action}
                            </button>
                        </div>
                    )
                })}
                {err && <p className="text-xs font-medium text-red-500">{err}</p>}
            </div>
        </Screen>
    )
}