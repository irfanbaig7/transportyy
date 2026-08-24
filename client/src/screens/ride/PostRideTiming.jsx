import { useNavigate } from 'react-router-dom'
import { Clock, Minus, Plus } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function PostRideTiming() {
    const navigate = useNavigate()
    const { rideDraft, setRideDraft } = useApp()

    return (
        <Screen
            header={<TopBar title="When & how many seats?" subtitle="Set time, seats and price." />}
            footer={<StickyCTA><Button full onClick={() => navigate('/post/review')}>Next</Button></StickyCTA>}
        >
            <div className="space-y-4">
                <Input label="Departure Time" icon={Clock} defaultValue={rideDraft.time} onChange={(e) => setRideDraft({ time: e.target.value })} />
                <div>
                    <span className="mb-1.5 block text-[13px] font-medium text-ink">Available Seats</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setRideDraft({ seats: Math.max(1, rideDraft.seats - 1) })} className="tap h-11 w-11 rounded-xl border border-line grid place-items-center">
                            <Minus size={18} />
                        </button>
                        <span className="text-lg font-bold text-ink w-6 text-center">{rideDraft.seats}</span>
                        <button onClick={() => setRideDraft({ seats: rideDraft.seats + 1 })} className="tap h-11 w-11 rounded-xl border border-line grid place-items-center">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                <Input label="Price per Seat (₹)" type="number" defaultValue={rideDraft.price} onChange={(e) => setRideDraft({ price: Number(e.target.value) })} />
            </div>
        </Screen>
    )
}