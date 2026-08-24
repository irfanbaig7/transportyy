import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../../components'

export default function PaymentProcessing() {
    const navigate = useNavigate()
    useEffect(() => {
        const t = setTimeout(() => navigate('/booking/success', { replace: true }), 1600)
        return () => clearTimeout(t)
    }, [navigate])

    return (
        <div className="flex flex-col h-full items-center justify-center gap-4">
            <Spinner size={40} />
            <p className="text-sm font-semibold text-ink">Processing your payment…</p>
            <p className="text-xs text-muted">Please don't close this screen.</p>
        </div>
    )
}