import { useState } from 'react'
import { ChevronDown, Phone, MessageCircle } from 'lucide-react'
import { Screen, TopBar, Button } from '../../components'

const FAQS = [
    { q: 'How do I book a ride?', a: 'Search your route on the Home screen, pick a ride and confirm your seat with payment.' },
    { q: 'How do I become a driver?', a: 'Go to Menu → Become a Driver and complete the sign-up steps with your car & documents.' },
    { q: 'Is my payment secure?', a: 'Yes, all payments are processed through secure, encrypted payment gateways.' },
    { q: 'How do I cancel a booking?', a: 'Open the trip from My Trips and tap Cancel before the ride starts.' },
]

export default function Help() {
    const [open, setOpen] = useState(0)
    return (
        <Screen header={<TopBar title="Help & Support" />}>
            <div className="rounded-2xl bg-surface border border-line divide-y divide-line mb-6">
                {FAQS.map((f, i) => (
                    <div key={i} className="px-4 py-3.5">
                        <button onClick={() => setOpen(open === i ? -1 : i)} className="tap w-full flex items-center justify-between text-left">
                            <span className="text-sm font-semibold text-ink pr-3">{f.q}</span>
                            <ChevronDown size={16} className={`text-muted shrink-0 transition ${open === i ? 'rotate-180' : ''}`} />
                        </button>
                        {open === i && <p className="text-sm text-muted mt-2">{f.a}</p>}
                    </div>
                ))}
            </div>
            <p className="text-sm font-bold text-ink mb-2">Still need help?</p>
            <div className="flex gap-3">
                <Button variant="outline" full icon={Phone}>Call Support</Button>
                <Button variant="outline" full icon={MessageCircle}>Live Chat</Button>
            </div>
        </Screen>
    )
}