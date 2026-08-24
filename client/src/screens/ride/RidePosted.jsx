import { CheckCircle2 } from 'lucide-react'
import { Button } from '../../components'

export default function RidePosted() {
    return (
        <div className="flex flex-col h-full px-6 pt-10 pb-8 items-center text-center">
            <span className="h-20 w-20 rounded-full bg-brand-light grid place-items-center mb-6">
                <CheckCircle2 size={44} className="text-brand" />
            </span>
            <h1 className="text-2xl font-extrabold text-ink">Ride Posted!</h1>
            <p className="mt-2 text-sm text-muted max-w-[260px]">Your ride is live. Passengers can now find and book it.</p>
            <div className="flex-1" />
            <div className="w-full space-y-3">
                <Button full to="/driver/dashboard">Go to Dashboard</Button>
                <Button full variant="outline" to="/trips">View My Trips</Button>
            </div>
        </div>
    )
}