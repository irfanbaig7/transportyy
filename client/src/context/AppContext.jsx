import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, saveSession, clearSession, loadSession } from '../api/client'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const session = loadSession()

  const [user, setUser] = useState(session?.user || null)
  const [isAuthed, setIsAuthed] = useState(!!session)
  const [role, setRole] = useState(session?.user?.role || 'passenger')
  const [isAvailable, setIsAvailable] = useState(session?.user?.isAvailable || false)

  const [rides, setRides] = useState([])
  const [trips, setTrips] = useState([])
  const [requests, setRequests] = useState([])
  const [driverTrips, setDriverTrips] = useState([])
  const [notifications, setNotifications] = useState([])
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Draft state carried across multi-step flows (kept client-side until submit)
  const [rideDraft, setRideDraft] = useState({
    from: '', to: '', via: '', date: '', time: '', seats: 2, price: 650,
  })
  const [search, setSearch] = useState({ from: '', to: '', date: '', passengers: 1 })
  const [filters, setFilters] = useState({ sort: 'best', maxPrice: 1000, ac: false, verifiedOnly: false, seats: 1 })
  const [lastBooking, setLastBooking] = useState(null)

  // ---- Load "me" once we have a session ----
  useEffect(() => {
    if (!isAuthed) return
    api.getMe().then((d) => {
      setUser(d.user)
      setRole(d.user.role)
      setIsAvailable(d.user.isAvailable)
    }).catch(() => {
      clearSession()
      setIsAuthed(false)
    })
  }, [isAuthed])

  // ---- Refresh helpers (call after mutations, or on demand) ----
  const refreshNotifications = useCallback(() => {
    if (!isAuthed) return
    api.getNotifications().then((d) => setNotifications(d.notifications)).catch(() => { })
  }, [isAuthed])

  const refreshChats = useCallback(() => {
    if (!isAuthed) return
    api.getChats().then((d) => setChats(d.chats)).catch(() => { })
  }, [isAuthed])

  const refreshMyTrips = useCallback(() => {
    if (!isAuthed) return
    api.myBookings().then((d) => setTrips(d.bookings)).catch(() => { })
  }, [isAuthed])

  const refreshRequests = useCallback(() => {
    if (!isAuthed) return
    api.requests().then((d) => setRequests(d.bookings)).catch(() => { })
  }, [isAuthed])

  const refreshMyRides = useCallback(() => {
    if (!isAuthed) return
    api.myRides().then((d) => setDriverTrips(d.rides)).catch(() => { })
  }, [isAuthed])

  useEffect(() => {
    if (!isAuthed) return
    refreshNotifications()
    refreshChats()
    refreshMyTrips()
    refreshRequests()
    refreshMyRides()
  }, [isAuthed, refreshNotifications, refreshChats, refreshMyTrips, refreshRequests, refreshMyRides])

  const actions = useMemo(() => ({
    setRole,

    // ---- Auth ----
    signup: async (payload) => {
      setLoading(true); setError(null)
      try {
        const d = await api.signup(payload)
        saveSession(d.user, d.token)
        setUser(d.user)
        setRole(d.user.role)
        setIsAuthed(true)
        return d.user
      } catch (e) { setError(e.message); throw e } finally { setLoading(false) }
    },
    login: async (payload) => {
      setLoading(true); setError(null)
      try {
        const d = await api.login(payload)
        saveSession(d.user, d.token)
        setUser(d.user)
        setRole(d.user.role)
        setIsAuthed(true)
        return d.user
      } catch (e) { setError(e.message); throw e } finally { setLoading(false) }
    },
    logout: () => {
      clearSession()
      setIsAuthed(false)
      setUser(null)
      setTrips([]); setRequests([]); setDriverTrips([]); setNotifications([]); setChats([])
    },

    updateUser: async (patch) => {
      const d = await api.updateMe(patch)
      setUser(d.user)
      return d.user
    },

    toggleAvailability: async () => {
      const next = !isAvailable
      setIsAvailable(next)
      await api.setAvailability(next)
    },
    setAvailability: async (v) => {
      setIsAvailable(v)
      await api.setAvailability(v)
    },

    // ---- Driver onboarding ----
    updateDriverProfile: (payload) => api.updateDriverProfile(payload),
    updateDocuments: (payload) => api.updateDocuments(payload),
    becomeDriver: async () => {
      const d = await api.becomeDriver()
      setUser(d.user)
      setRole('driver')
      setIsAvailable(true)
      return d.user
    },

    // ---- Ride drafts / search / filters ----
    setRideDraft: (patch) => setRideDraft((d) => ({ ...d, ...patch })),
    setSearch: (patch) => setSearch((s) => ({ ...s, ...patch })),
    setFilters: (patch) => setFilters((f) => ({ ...f, ...patch })),

    // ---- Rides ----
    searchRides: async (params) => {
      setLoading(true)
      try {
        const d = await api.searchRides(params)
        setRides(d.rides)
        return d.rides
      } finally { setLoading(false) }
    },
    postRide: async (data) => {
      const draft = { ...rideDraft, ...data }
      const d = await api.postRide(draft)
      refreshMyRides()
      return d.ride
    },

    // ---- Booking ----
    bookRide: async ({ ride, seats = 1, paymentMethod = 'UPI' }) => {
      const d = await api.createBooking({ rideId: ride._id || ride.id, seats, paymentMethod })
      setLastBooking(d.booking)
      refreshMyTrips()
      return d.booking
    },
    cancelBooking: async (tripId, reason = '') => {
      await api.cancelBooking(tripId, reason)
      refreshMyTrips()
    },
    startTrip: async (tripId) => { await api.startBooking(tripId); refreshMyTrips() },
    completeTrip: async (tripId) => { await api.completeBooking(tripId); refreshMyTrips() },
    rateTrip: async (tripId, rating, text = '') => { await api.rateBooking(tripId, rating, text); refreshMyTrips() },

    acceptRequest: async (id) => { await api.acceptBooking(id); refreshRequests() },
    rejectRequest: async (id) => { await api.rejectBooking(id); refreshRequests() },

    // ---- Notifications ----
    markAllNotificationsRead: async () => {
      setNotifications((n) => n.map((x) => ({ ...x, unread: false })))
      await api.markAllRead()
    },

    // ---- Chat ----
    sendMessage: async (chatId, text) => {
      const d = await api.sendMessage(chatId, text)
      setChats((cs) => cs.map((c) => (c._id === chatId ? d.chat : c)))
    },

    refreshNotifications, refreshChats, refreshMyTrips, refreshRequests, refreshMyRides,
  }), [isAvailable, rideDraft, refreshNotifications, refreshChats, refreshMyTrips, refreshRequests, refreshMyRides])

  const getters = useMemo(() => ({
    getRideById: (id) => rides.find((r) => r._id === id || r.id === id),
    getTripById: (id) => trips.find((t) => t._id === id || t.id === id),
    getChatById: (id) => chats.find((c) => c._id === id || c.id === id),
    unreadNotifications: notifications.filter((n) => n.unread).length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
  }), [rides, trips, chats, notifications, requests])

  const value = {
    user, isAuthed, role, isAvailable, loading, error,
    rides, trips, requests, driverTrips, notifications, chats,
    rideDraft, search, filters, lastBooking,
    ...actions,
    ...getters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}