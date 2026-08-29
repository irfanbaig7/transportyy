import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const DRIVER_ONBOARDING_PATHS = ['/driver/basic', '/driver/car', '/driver/documents', '/driver/review']

// Wraps protected routes:
// 1) No session -> bounce to /login
// 2) Driver jiska onboarding (car details) incomplete hai -> pehle onboarding hi dikhega
// 3) Passenger jo /post/* (ride posting) tak pahunchne ki koshish kare -> home pe bounce
export default function RequireAuth() {
    const { isAuthed, role, user } = useApp()
    const location = useLocation()

    if (!isAuthed) return <Navigate to="/login" replace />

    const isOnboardingPath = DRIVER_ONBOARDING_PATHS.some((p) => location.pathname.startsWith(p))
    if (role === 'driver' && user && !user.driverProfileComplete && !isOnboardingPath) {
        return <Navigate to="/driver/basic" replace />
    }

    if (role === 'passenger' && location.pathname.startsWith('/post/')) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />
}