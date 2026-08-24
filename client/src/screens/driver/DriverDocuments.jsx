import { useNavigate } from 'react-router-dom'
import { FileText, Camera } from 'lucide-react'
import { Screen, TopBar, Button, Stepper, StickyCTA } from '../../components'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverDocuments() {
    const navigate = useNavigate()
    const rows = [
        { label: 'Driving License', action: 'Upload Front', icon: FileText },
        { label: 'RC (Registration Certificate)', action: 'Upload', icon: FileText },
        { label: 'Car Insurance', action: 'Upload', icon: FileText },
        { label: 'Profile Photo', action: 'Upload', icon: Camera },
    ]
    return (
        <Screen
            header={<TopBar title="Driver Sign Up" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/driver/review')}>Next</Button></StickyCTA>}
        >
            <Stepper steps={STEPS} current={2} />
            <h2 className="text-xl font-extrabold mt-6">Upload Documents</h2>
            <p className="text-sm text-muted mt-1 mb-5">Keep your documents updated.</p>
            <div className="space-y-3">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between p-4 rounded-xl border border-line bg-surface">
                        <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                            <r.icon size={18} className="text-muted" /> {r.label}
                        </span>
                        <button className="tap text-xs font-semibold text-brand px-3 py-1.5 rounded-lg bg-brand-tint">{r.action}</button>
                    </div>
                ))}
            </div>
        </Screen>
    )
}