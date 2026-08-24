import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar } from 'lucide-react'
import { Screen, TopBar, Button, Input, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function PostRideRoute() {
    const navigate = useNavigate()
    const { rideDraft, setRideDraft } = useApp()

    return (
        <Screen
            header={<TopBar title="Where are you going?" subtitle="Add your route & basic info" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/post/timing')}>Next</Button></StickyCTA>}
        >
            <div className="space-y-4">
                <Input label="From" icon={MapPin} defaultValue={rideDraft.from} onChange={(e) => setRideDraft({ from: e.target.value })} />
                <Input label="To" icon={MapPin} defaultValue={rideDraft.to} onChange={(e) => setRideDraft({ to: e.target.value })} />
                <Input label="Via" icon={MapPin} placeholder="e.g. Wardha, Yavatmal" optional defaultValue={rideDraft.via} onChange={(e) => setRideDraft({ via: e.target.value })} />
                <Input label="Date" icon={Calendar} defaultValue={rideDraft.date} onChange={(e) => setRideDraft({ date: e.target.value })} />
            </div>
        </Screen>
    )
}