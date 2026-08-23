import { createContext, useContext, useMemo, useState } from 'react'
import * as mock from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(mock.currentUser)
  const [role, setRole] = useState('passenger') // 'passenger' | 'driver'
  const [isAvailable, setIsAvailable] = useState(true)

  const [rides] = useState(mock.rides)
  const [trips, setTrips] = useState(mock.trips)
  const [requests, setRequests] = useState(mock.bookingRequests)
  const [driverTrips] = useState(mock.driverTrips)
  const [notifications, setNotifications] = useState(mock.notifications)
  const [chats, setChats] = useState(mock.chats)

  // Draft state carried across multi-step flows
  const [rideDraft, setRideDraft] = useState({
    from: 'Pune, Maharashtra', to: 'Nagpur, Maharashtra', via: '',
    date: '22 May 2025', time: '10:00 AM', seats: 2, price: 650,
  })
  const [search, setSearch] = useState({ from: 'Pune', to: 'Nagpur', date: '22 May 2025', passengers: 1 })
  const [filters, setFilters] = useState({ sort: 'best', maxPrice: 1000, ac: false, verifiedOnly: false, seats: 1 })
  const [lastBooking, setLastBooking] = useState(null)

  const actions = useMemo(() => ({
    setRole,
    updateUser: (patch) => setUser((u) => ({ ...u, ...patch })),
    toggleAvailability: () => setIsAvailable((v) => !v),
    setAvailability: (v) => setIsAvailable(v),

    setRideDraft: (patch) => setRideDraft((d) => ({ ...d, ...patch })),
    setSearch: (patch) => setSearch((s) => ({ ...s, ...patch })),
    setFilters: (patch) => setFilters((f) => ({ ...f, ...patch })),

    // Passenger books a ride -> creates an upcoming trip
    bookRide: ({ ride, seats = 1, paymentMethod = 'UPI' }) => {
      const pricePerSeat = ride.price
      const subtotal = pricePerSeat * seats
      const fee = 20
      const trip = {
        id: 't' + Date.now(),
        status: 'upcoming',
        from: ride.from, to: ride.to, via: ride.via,
        date: ride.date, time: ride.time,
        driver: ride.driver, car: ride.car,
        seats, pricePerSeat, fee, total: subtotal + fee,
        otp: String(Math.floor(1000 + Math.random() * 9000)),
        paymentMethod, rated: false,
      }
      setTrips((t) => [trip, ...t])
      setLastBooking(trip)
      return trip
    },

    cancelBooking: (tripId, reason = '') => {
      setTrips((t) => t.map((x) => (x.id === tripId ? { ...x, status: 'cancelled', cancelReason: reason } : x)))
    },

    startTrip: (tripId) => {
      setTrips((t) => t.map((x) => (x.id === tripId ? { ...x, status: 'ongoing', progress: 0.1 } : x)))
    },
    completeTrip: (tripId) => {
      setTrips((t) => t.map((x) => (x.id === tripId ? { ...x, status: 'completed', progress: 1 } : x)))
    },

    rateTrip: (tripId, rating, text = '') => {
      setTrips((t) => t.map((x) => (x.id === tripId ? { ...x, rated: true, myRating: rating, myReview: text } : x)))
    },

    acceptRequest: (id) => setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: 'accepted' } : x))),
    rejectRequest: (id) => setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: 'rejected' } : x))),

    postRide: (data) => {
      // In a real app this would POST to the server; here we just stash the draft.
      setRideDraft((d) => ({ ...d, ...data }))
      return { id: 'dt' + Date.now(), ...rideDraft, ...data }
    },

    markAllNotificationsRead: () => setNotifications((n) => n.map((x) => ({ ...x, unread: false }))),

    sendMessage: (chatId, text) => {
      setChats((cs) => cs.map((c) => c.id === chatId
        ? { ...c, lastMessage: text, lastTime: 'now', messages: [...c.messages, { id: 'm' + Date.now(), from: 'me', text, time: 'now' }] }
        : c))
    },
  }), [rideDraft])

  const getters = useMemo(() => ({
    getRideById: (id) => rides.find((r) => r.id === id),
    getTripById: (id) => trips.find((t) => t.id === id),
    getChatById: (id) => chats.find((c) => c.id === id),
    unreadNotifications: notifications.filter((n) => n.unread).length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
  }), [rides, trips, chats, notifications, requests])

  const value = {
    user, role, isAvailable,
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
