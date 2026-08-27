import { Rocket } from 'lucide-react'
import { Button } from '../components'

export default function GetStarted() {
    return (
        <div className="flex flex-col h-full px-6 pt-8 pb-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="h-48 w-48 rounded-[2rem] bg-brand-tint grid place-items-center mb-8">
                    <Rocket size={64} className="text-brand" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-extrabold">Let's Get You Started!</h1>
                <p className="mt-2 text-sm text-muted max-w-[260px]">Create your account or login to continue.</p>
            </div>
            <div className="space-y-3">
                <Button full to="/signup">Create Account</Button>
                <Button full variant="outline" to="/login">Log In</Button>
            </div>
        </div>
    )
}