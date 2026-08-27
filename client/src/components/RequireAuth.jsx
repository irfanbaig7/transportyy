import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Wraps protected routes: if there's no logged-in session, bounce to /login
// instead of letting a screen crash on a null user.
export default function RequireAuth() {
    const { isAuthed } = useApp()
    if (!isAuthed) return <Navigate to="/login" replace />
    return <Outlet />
}