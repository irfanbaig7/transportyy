// ---- Mock data for the whole prototype ----
// Everything is in-memory. No backend calls.

export const currentUser = {
  id: 'u1',
  name: 'Vikas Sharma',
  phone: '+91 98765 43210',
  email: 'vikas.sharma@gmail.com',
  city: 'Pune, Maharashtra',
  rating: 4.8,
  tripsCount: 128,
  memberSince: 'Mar 2023',
  verified: true,
  car: {
    brand: 'Honda City',
    number: 'MH12 AB 1234',
    year: '2020',
    type: '4 Wheeler',
    color: 'White',
    ac: true,
  },
}

// Rides a passenger can find (search results)
export const rides = [
  {
    id: 'r1',
    driver: { id: 'd1', name: 'Vikas Sharma', rating: 4.8, reviews: 128, verified: true, tags: ['Experienced', 'Polite', 'On-time'] },
    car: { brand: 'Honda City', number: 'MH12 AB 1234', type: '4 Wheeler', ac: true },
    from: 'Pune', to: 'Nagpur', via: 'Wardha',
    date: '22 May 2025', time: '10:00 AM',
    seatsTotal: 3, seatsAvailable: 2, price: 650, distanceAway: '4.2 km',
  },
  {
    id: 'r2',
    driver: { id: 'd2', name: 'Rahul Patil', rating: 4.6, reviews: 64, verified: true, tags: ['Friendly', 'Music ok'] },
    car: { brand: 'Hyundai Verna', number: 'MH31 CD 5678', type: '4 Wheeler', ac: true },
    from: 'Pune', to: 'Nagpur', via: 'Wardha',
    date: '22 May 2025', time: '10:30 AM',
    seatsTotal: 3, seatsAvailable: 3, price: 600, distanceAway: '4.5 km',
  },
  {
    id: 'r3',
    driver: { id: 'd3', name: 'Amit Deshmukh', rating: 4.7, reviews: 90, verified: true, tags: ['Quiet ride', 'Non-smoking'] },
    car: { brand: 'Maruti Ciaz', number: 'MH02 EF 9012', type: '4 Wheeler', ac: true },
    from: 'Pune', to: 'Nagpur', via: 'Wardha',
    date: '22 May 2025', time: '11:00 AM',
    seatsTotal: 2, seatsAvailable: 2, price: 700, distanceAway: '8.1 km',
  },
  {
    id: 'r4',
    driver: { id: 'd4', name: 'Sana Shaikh', rating: 4.9, reviews: 210, verified: true, tags: ['Top rated', 'Women-friendly'] },
    car: { brand: 'Toyota Innova', number: 'MH14 GH 3344', type: '4 Wheeler', ac: true },
    from: 'Pune', to: 'Nagpur', via: 'Ahmednagar',
    date: '22 May 2025', time: '01:30 PM',
    seatsTotal: 5, seatsAvailable: 4, price: 720, distanceAway: '9.6 km',
  },
]

// Passenger's booked trips (all statuses represented)
export const trips = [
  {
    id: 't1', status: 'upcoming',
    from: 'Pune', to: 'Nagpur', via: 'Wardha',
    date: '22 May 2025', time: '10:00 AM',
    driver: { name: 'Vikas Sharma', rating: 4.8, verified: true },
    car: { brand: 'Honda City', number: 'MH12 AB 1234', type: '4 Wheeler' },
    seats: 1, pricePerSeat: 650, fee: 20, total: 670,
    otp: '4821', rated: false,
  },
  {
    id: 't2', status: 'ongoing',
    from: 'Pune', to: 'Mumbai', via: 'Lonavala',
    date: '20 May 2025', time: '08:00 AM',
    driver: { name: 'Rahul Patil', rating: 4.6, verified: true },
    car: { brand: 'Hyundai Verna', number: 'MH31 CD 5678', type: '4 Wheeler' },
    seats: 2, pricePerSeat: 400, fee: 20, total: 820,
    otp: '2093', rated: false, progress: 0.55,
  },
  {
    id: 't3', status: 'completed',
    from: 'Pune', to: 'Kolhapur', via: null,
    date: '12 May 2025', time: '09:00 AM',
    driver: { name: 'Amit Deshmukh', rating: 4.7, verified: true },
    car: { brand: 'Maruti Ciaz', number: 'MH02 EF 9012', type: '4 Wheeler' },
    seats: 1, pricePerSeat: 500, fee: 20, total: 520,
    rated: false,
  },
  {
    id: 't4', status: 'cancelled',
    from: 'Pune', to: 'Nashik', via: null,
    date: '05 May 2025', time: '06:30 AM',
    driver: { name: 'Sana Shaikh', rating: 4.9, verified: true },
    car: { brand: 'Toyota Innova', number: 'MH14 GH 3344', type: '4 Wheeler' },
    seats: 1, pricePerSeat: 450, fee: 20, total: 470,
    rated: false, cancelReason: 'Plan changed',
  },
]

// Booking requests a driver receives (accept / reject)
export const bookingRequests = [
  {
    id: 'bq1', status: 'pending',
    passenger: { name: 'Sneha Kulkarni', rating: 4.9, trips: 42 },
    from: 'Pune', to: 'Nagpur', date: '22 May 2025', time: '10:00 AM',
    seats: 1, amount: 650,
  },
  {
    id: 'bq2', status: 'pending',
    passenger: { name: 'Imran Sheikh', rating: 4.5, trips: 12 },
    from: 'Pune', to: 'Wardha', date: '22 May 2025', time: '10:00 AM',
    seats: 2, amount: 900,
  },
]

// Driver's own posted / upcoming trips
export const driverTrips = [
  {
    id: 'dt1', from: 'Pune', to: 'Nagpur', via: 'Wardha',
    date: '22 May 2025', time: '10:00 AM',
    seatsTotal: 3, seatsBooked: 2, pricePerSeat: 650,
  },
]

export const notifications = [
  { id: 'n1', type: 'booking', title: 'New booking request', body: 'Sneha Kulkarni wants 1 seat, Pune → Nagpur.', time: '2m ago', unread: true },
  { id: 'n2', type: 'payment', title: 'Payment received', body: '₹670 credited for your Pune → Nagpur ride.', time: '1h ago', unread: true },
  { id: 'n3', type: 'trip', title: 'Trip reminder', body: 'Your ride to Nagpur starts in 2 hours.', time: '3h ago', unread: false },
  { id: 'n4', type: 'rating', title: 'You got a 5-star rating', body: 'Amit rated your last ride. Nice work!', time: 'Yesterday', unread: false },
  { id: 'n5', type: 'promo', title: 'Refer & earn ₹100', body: 'Invite a friend to the community.', time: '2d ago', unread: false },
]

export const chats = [
  {
    id: 'c1',
    with: { name: 'Vikas Sharma', rating: 4.8, online: true },
    lastMessage: 'Sure, I will be at the pickup point by 9:55.',
    lastTime: '2m',
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi! Confirming your seat for tomorrow, Pune → Nagpur.', time: '9:40 AM' },
      { id: 'm2', from: 'me', text: 'Great, thank you! Where should I wait?', time: '9:42 AM' },
      { id: 'm3', from: 'them', text: 'Near Shivajinagar bus stand, gate 2.', time: '9:43 AM' },
      { id: 'm4', from: 'them', text: 'Sure, I will be at the pickup point by 9:55.', time: '9:45 AM' },
    ],
  },
  {
    id: 'c2',
    with: { name: 'Sneha Kulkarni', rating: 4.9, online: false },
    lastMessage: 'Okay, see you then!',
    lastTime: '1h',
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Is the ride still on for 10 AM?', time: '8:10 AM' },
      { id: 'm2', from: 'me', text: 'Yes, all set.', time: '8:15 AM' },
      { id: 'm3', from: 'them', text: 'Okay, see you then!', time: '8:16 AM' },
    ],
  },
]

export const reviews = [
  { id: 'rv1', name: 'Amit D.', rating: 5, text: 'Smooth ride, very punctual. Would travel again.', time: '2 weeks ago' },
  { id: 'rv2', name: 'Priya M.', rating: 5, text: 'Safe driving and friendly. Highly recommend.', time: '1 month ago' },
  { id: 'rv3', name: 'Karan S.', rating: 4, text: 'Good experience overall, car was clean.', time: '1 month ago' },
]

export const popularRoutes = [
  { from: 'Pune', to: 'Nagpur', price: 650 },
  { from: 'Pune', to: 'Mumbai', price: 400 },
  { from: 'Pune', to: 'Kolhapur', price: 500 },
  { from: 'Mumbai', to: 'Nashik', price: 450 },
]
