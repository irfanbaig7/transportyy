import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api, saveSession, clearSession, loadSession } from '../api/client'
import { connectSocket, disconnectSocket } from '../socket'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const session = loadSession()

  const [darkMode, setDarkModeState] = useState(() => localStorage.getItem('chalo_dark') === 'true')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('chalo_dark', String(darkMode))
  }, [darkMode])
  const setDarkMode = (v) => setDarkModeState(v)

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

  const [rideDraft, setRideDraft] = useState({
    from: '', to: '', via: '', date: '', time: '', seats: 2, price: 650,
  })
  const [search, setSearch] = useState({ from: '', to: '', date: '', passengers: 1 })
  const [filters, setFilters] = useState({ sort: 'best', maxPrice: 1000, ac: false, verifiedOnly: false, seats: 1 })
  const [lastBooking, setLastBooking] = useState(null)

  // ---- Real-time (Socket.io) ----
  const [socket, setSocket] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const clearIncomingCall = useCallback(() => setIncomingCall(null), [])

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

  useEffect(() => {
    if (!isAuthed) {
      disconnectSocket()
      setSocket(null)
      return
    }
    const token = localStorage.getItem('chalo_token')
    if (!token) return
    const s = connectSocket(token)
    setSocket(s)
  }, [isAuthed])

  useEffect(() => {
    if (!socket || !user) return
    const myId = String(user._id)

    const onChatMessage = ({ chatId, message }) => {
      setChats((cs) => {
        const idx = cs.findIndex((c) => String(c._id || c.id) === String(chatId))
        if (idx === -1) {
          refreshChats()
          return cs
        }
        const updated = [...cs]
        const chat = { ...updated[idx] }
        chat.messages = [...(chat.messages || []), message]
        chat.lastMessage = message.text
        chat.lastTime = 'now'
        const mine = String(message.sender) === myId
        if (!mine) chat.unread = (chat.unread || 0) + 1
        updated[idx] = chat
        return updated
      })
    }

    const onIncomingCall = (payload) => setIncomingCall(payload)
    const onCallEnded = ({ fromUserId }) => {
      setIncomingCall((c) => (c && c.fromUserId === fromUserId ? null : c))
    }

    const onBookingNew = () => {
      refreshRequests()
      refreshMyRides()
      refreshNotifications()
    }
    const onBookingUpdated = () => {
      refreshMyTrips()
      refreshRequests()
      refreshMyRides()
      refreshNotifications()
    }

    socket.on('chat:message', onChatMessage)
    socket.on('call:incoming', onIncomingCall)
    socket.on('call:ended', onCallEnded)
    socket.on('booking:new', onBookingNew)      // 👈 ADD
    socket.on('booking:updated', onBookingUpdated)  // 👈 ADD

    return () => {
      socket.off('chat:message', onChatMessage)
      socket.off('call:incoming', onIncomingCall)
      socket.off('call:ended', onCallEnded)
      socket.off('booking:new', onBookingNew)      // 👈 ADD
      socket.off('booking:updated', onBookingUpdated)  // 👈 ADD
    }
  }, [socket, user, refreshChats, refreshRequests, refreshMyRides, refreshNotifications])

  const actions = useMemo(() => ({
    setRole,

    signup: async (payload) => {
      setLoading(true); setError(null)
      try {
        const d = await api.signup(payload)
        saveSession(d.user, d.token)
        setUser(d.user); setRole(d.user.role); setIsAuthed(true)
        return d.user
      } catch (e) { setError(e.message); throw e } finally { setLoading(false) }
    },
    login: async (payload) => {
      setLoading(true); setError(null)
      try {
        const d = await api.login(payload)
        saveSession(d.user, d.token)
        setUser(d.user); setRole(d.user.role); setIsAuthed(true)
        return d.user
      } catch (e) { setError(e.message); throw e } finally { setLoading(false) }
    },
    logout: () => {
      clearSession()
      disconnectSocket()
      setSocket(null)
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

    updateDriverProfile: (payload) => api.updateDriverProfile(payload),
    updateDocuments: (payload) => api.updateDocuments(payload),
    becomeDriver: async () => {
      const d = await api.becomeDriver()
      setUser(d.user); setRole('driver'); setIsAvailable(true)
      return d.user
    },

    setRideDraft: (patch) => setRideDraft((d) => ({ ...d, ...patch })),
    setSearch: (patch) => setSearch((s) => ({ ...s, ...patch })),
    setFilters: (patch) => setFilters((f) => ({ ...f, ...patch })),

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

    bookRide: async ({ ride, seats = 1, paymentMethod = 'UPI' }) => {
      const d = await api.createBooking({ rideId: ride._id || ride.id, seats, paymentMethod })
      setLastBooking(d.booking)
      refreshMyTrips()
      return d.booking
    },
    cancelBooking: async (tripId, reason = '') => { await api.cancelBooking(tripId, reason); refreshMyTrips() },
    startTrip: async (tripId, otp) => { await api.startBooking(tripId, otp); refreshMyTrips() }, completeTrip: async (tripId) => { await api.completeBooking(tripId); refreshMyTrips() },
    rateTrip: async (tripId, rating, text = '') => { await api.rateBooking(tripId, rating, text); refreshMyTrips() },

    acceptRequest: async (id) => { await api.acceptBooking(id); refreshRequests(); refreshMyRides() },
    rejectRequest: async (id) => { await api.rejectBooking(id); refreshRequests(); refreshMyRides() },

    markAllNotificationsRead: async () => {
      setNotifications((n) => n.map((x) => ({ ...x, unread: false })))
      await api.markAllRead()
    },

    sendMessage: (chatId, text) => {
      return new Promise((resolve, reject) => {
        if (socket && socket.connected) {
          socket.emit('chat:send', { chatId, text }, (res) => {
            if (res?.ok) resolve(res.message)
            else reject(new Error(res?.error || 'Failed to send message.'))
          })
        } else {
          api.sendMessage(chatId, text).then((d) => { refreshChats(); resolve(d) }).catch(reject)
        }
      })
    },
    markChatRead: (chatId) => {
      setChats((cs) => cs.map((c) => (String(c._id || c.id) === String(chatId) ? { ...c, unread: 0 } : c)))
    },
    clearIncomingCall,

    refreshNotifications, refreshChats, refreshMyTrips, refreshRequests, refreshMyRides,
  }), [isAvailable, rideDraft, socket, refreshNotifications, refreshChats, refreshMyTrips, refreshRequests, refreshMyRides, clearIncomingCall])

  const getters = useMemo(() => ({
    getRideById: (id) => rides.find((r) => r._id === id || r.id === id),
    getTripById: (id) => trips.find((t) => t._id === id || t.id === id),
    getChatById: (id) => chats.find((c) => String(c._id || c.id) === String(id)),
    unreadNotifications: notifications.filter((n) => n.unread).length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
  }), [rides, trips, chats, notifications, requests])

  const value = {
    user, isAuthed, role, isAvailable, loading, error,
    darkMode, setDarkMode,
    socket, incomingCall,
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