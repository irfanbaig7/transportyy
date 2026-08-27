import { useState } from 'react'
import { Screen, TopBar, Toggle } from '../../components'
import { useApp } from '../../context/AppContext'

export default function Settings() {
    const { darkMode, setDarkMode } = useApp()
    const [push, setPush] = useState(true)
    const [email, setEmail] = useState(true)
    const [locationShare, setLocationShare] = useState(true)

    return (
        <Screen header={<TopBar title="Settings" />}>
            <p className="text-xs font-bold text-muted uppercase mb-2">Notifications</p>
            <div className="rounded-2xl bg-surface border border-line divide-y divide-line mb-6">
                <Row label="Push Notifications" checked={push} onChange={setPush} />
                <Row label="Email Notifications" checked={email} onChange={setEmail} />
            </div>
            <p className="text-xs font-bold text-muted uppercase mb-2">Privacy</p>
            <div className="rounded-2xl bg-surface border border-line divide-y divide-line mb-6">
                <Row label="Share Live Location on Trips" checked={locationShare} onChange={setLocationShare} />
            </div>
            <p className="text-xs font-bold text-muted uppercase mb-2">Appearance</p>
            <div className="rounded-2xl bg-surface border border-line divide-y divide-line">
                <Row label="Dark Mode" checked={darkMode} onChange={setDarkMode} />
            </div>
        </Screen>
    )
}

function Row({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm font-medium text-ink">{label}</span>
            <Toggle checked={checked} onChange={onChange} />
        </div>
    )
}