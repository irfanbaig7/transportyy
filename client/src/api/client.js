// Central place for all backend calls.
// Vite proxy (vite.config.js) forwards /api/* to http://localhost:5000
const BASE = '/api'

function getToken() {
    return localStorage.getItem('chalo_token')
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (auth && token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
    return data
}

export const api = {
    // ---- Auth ----
    signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
    login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
    forgotPassword: (phone) => request('/auth/forgot-password', { method: 'POST', body: { phone }, auth: false }),
    verifyOtp: (phone, otp) => request('/auth/verify-otp', { method: 'POST', body: { phone, otp }, auth: false }),
    resetPassword: (phone, otp, newPassword) =>
        request('/auth/reset-password', { method: 'POST', body: { phone, otp, newPassword }, auth: false }),

    // ---- User ----
    getMe: () => request('/users/me'),
    updateMe: (payload) => request('/users/me', { method: 'PATCH', body: payload }),
    updateDriverProfile: (payload) => request('/users/driver-profile', { method: 'PATCH', body: payload }),
    updateDocuments: (payload) => request('/users/documents', { method: 'PATCH', body: payload }),
    becomeDriver: () => request('/users/become-driver', { method: 'POST' }),
    setAvailability: (isAvailable) => request('/users/availability', { method: 'PATCH', body: { isAvailable } }),

    // ---- Rides ----
    searchRides: (params = {}) => {
        const qs = new URLSearchParams(params).toString()
        return request(`/rides${qs ? `?${qs}` : ''}`, { auth: false })
    },
    getRide: (id) => request(`/rides/${id}`, { auth: false }),
    postRide: (payload) => request('/rides', { method: 'POST', body: payload }),
    myRides: () => request('/rides/mine'),

    // ---- Bookings ----
    createBooking: (payload) => request('/bookings', { method: 'POST', body: payload }),
    myBookings: (status) => request(`/bookings/mine${status ? `?status=${status}` : ''}`),
    requests: () => request('/bookings/requests'),
    getBooking: (id) => request(`/bookings/${id}`),
    acceptBooking: (id) => request(`/bookings/${id}/accept`, { method: 'PATCH' }),
    rejectBooking: (id) => request(`/bookings/${id}/reject`, { method: 'PATCH' }),
    cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PATCH', body: { reason } }),
    startBooking: (id) => request(`/bookings/${id}/start`, { method: 'PATCH' }),
    completeBooking: (id) => request(`/bookings/${id}/complete`, { method: 'PATCH' }),
    rateBooking: (id, rating, text) => request(`/bookings/${id}/rate`, { method: 'PATCH', body: { rating, text } }),

    // ---- Notifications ----
    getNotifications: () => request('/notifications'),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),

    // ---- Chats ----
    getChats: () => request('/chats'),
    getChat: (id) => request(`/chats/${id}`),
    sendMessage: (id, text) => request(`/chats/${id}/messages`, { method: 'POST', body: { text } }),
    startChat: (otherUserId) => request('/chats', { method: 'POST', body: { otherUserId } }),
}

export function saveSession(user, token) {
    localStorage.setItem('chalo_token', token)
    localStorage.setItem('chalo_user', JSON.stringify(user))
}
export function clearSession() {
    localStorage.removeItem('chalo_token')
    localStorage.removeItem('chalo_user')
}
export function loadSession() {
    const token = getToken()
    const userRaw = localStorage.getItem('chalo_user')
    if (!token || !userRaw) return null
    try {
        return { token, user: JSON.parse(userRaw) }
    } catch {
        return null
    }
}