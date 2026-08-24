import { XCircle } from 'lucide-react'
import { Button } from '../../components'
import { useNavigate } from 'react-router-dom'

export default function PaymentFailed() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col h-full px-6 pt-10 pb-8 items-center text-center">
            <span className="h-20 w-20 rounded-full bg-red-50 grid place-items-center mb-6">
                <XCircle size={44} className="text-red-500" />
            </span>
            <h1 className="text-2xl font-extrabold text-ink">Payment Failed</h1>
            <p className="mt-2 text-sm text-muted max-w-[260px]">Something went wrong while processing your payment. No amount was deducted.</p>
            <div className="flex-1" />
            <div className="w-full space-y-3">
                <Button full onClick={() => navigate(-1)}>Try Again</Button>
                <Button full variant="outline" to="/home">Back to Home</Button>
            </div>
        </div>
    )
}