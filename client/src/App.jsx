import { Routes, Route, Navigate } from 'react-router-dom'
import Device from './components/Device'
import IncomingCallSheet from './components/IncomingCallSheet'
import RequireAuth from './components/RequireAuth'

// Onboarding + Auth
import Onboarding from './screens/Onboarding'
import ChooseRole from './screens/ChooseRole'
import GetStarted from './screens/GetStarted'
import Login from './screens/Login'
import CreateAccount from './screens/CreateAccount'
import ForgotPassword from './screens/ForgotPassword'
import OtpVerify from './screens/OtpVerify'
import ResetPassword from './screens/ResetPassword'

// Driver
import DriverBasicInfo from './screens/driver/DriverBasicInfo'
import DriverCarDetails from './screens/driver/DriverCarDetails'
import DriverDocuments from './screens/driver/DriverDocuments'
import DriverReview from './screens/driver/DriverReview'
import DriverDashboard from './screens/driver/DriverDashboard'
import BookingRequests from './screens/driver/BookingRequests'
import Earnings from './screens/driver/Earnings'

// Ride posting + passenger booking
import PostRideRoute from './screens/ride/PostRideRoute'
import PostRideTiming from './screens/ride/PostRideTiming'
import PostRideReview from './screens/ride/PostRideReview'
import RidePosted from './screens/ride/RidePosted'
import PassengerSearch from './screens/ride/PassengerSearch'
import SearchFilters from './screens/ride/SearchFilters'
import RideDetails from './screens/ride/RideDetails'
import BookingPayment from './screens/ride/BookingPayment'
import PaymentProcessing from './screens/ride/PaymentProcessing'
import BookingConfirmed from './screens/ride/BookingConfirmed'
import PaymentFailed from './screens/ride/PaymentFailed'

// Trips
import MyTrips from './screens/trips/MyTrips'
import TripDetails from './screens/trips/TripDetails'
import TripOngoing from './screens/trips/TripOngoing'
import TripCompleted from './screens/trips/TripCompleted'
import CancelBooking from './screens/trips/CancelBooking'
import RateReview from './screens/trips/RateReview'

// App / common
import Home from './screens/app/Home'
import Notifications from './screens/app/Notifications'
import ChatList from './screens/app/ChatList'
import ChatThread from './screens/app/ChatThread'
import CallScreen from './screens/app/CallScreen'
import Profile from './screens/app/Profile'
import EditProfile from './screens/app/EditProfile'
import Menu from './screens/app/Menu'
import Settings from './screens/app/Settings'
import Help from './screens/app/Help'
import StatesGallery from './screens/app/StatesGallery'
import { useApp } from './context/AppContext'

// Agar user pehle se logged in hai, to Onboarding/Login/Signup screens
// dobara mat dikhao — seedha uske role ke hisab se home pe bhej do.
function RedirectIfAuthed({ children }) {
  const { isAuthed, role, user } = useApp()
  if (isAuthed) {
    if (role === 'driver' && user && !user.driverProfileComplete) {
      return <Navigate to="/driver/basic" replace />
    }
    return <Navigate to={role === 'driver' ? '/driver/dashboard' : '/home'} replace />
  }
  return children
}

export default function App() {
  return (
    <Device>
      <Routes>
        {/* Public — onboarding + auth */}
        <Route path="/" element={<RedirectIfAuthed><Onboarding /></RedirectIfAuthed>} />
        <Route path="/onboarding" element={<RedirectIfAuthed><Onboarding /></RedirectIfAuthed>} />
        <Route path="/role" element={<RedirectIfAuthed><ChooseRole /></RedirectIfAuthed>} />
        <Route path="/get-started" element={<RedirectIfAuthed><GetStarted /></RedirectIfAuthed>} />
        <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
        <Route path="/signup" element={<RedirectIfAuthed><CreateAccount /></RedirectIfAuthed>} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/reset" element={<ResetPassword />} />



        {/* Everything below requires a logged-in session */}
        <Route element={<RequireAuth />}>
          {/* Driver */}
          <Route path="/driver/basic" element={<DriverBasicInfo />} />
          <Route path="/driver/car" element={<DriverCarDetails />} />
          <Route path="/driver/documents" element={<DriverDocuments />} />
          <Route path="/driver/review" element={<DriverReview />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/requests" element={<BookingRequests />} />
          <Route path="/driver/earnings" element={<Earnings />} />

          {/* Ride posting + booking */}
          <Route path="/post/route" element={<PostRideRoute />} />
          <Route path="/post/timing" element={<PostRideTiming />} />
          <Route path="/post/review" element={<PostRideReview />} />
          <Route path="/post/success" element={<RidePosted />} />
          <Route path="/search" element={<PassengerSearch />} />
          <Route path="/filters" element={<SearchFilters />} />
          <Route path="/ride/:id" element={<RideDetails />} />
          <Route path="/booking/payment/:id" element={<BookingPayment />} />
          <Route path="/booking/processing" element={<PaymentProcessing />} />
          <Route path="/booking/success" element={<BookingConfirmed />} />
          <Route path="/booking/failed" element={<PaymentFailed />} />

          {/* Trips */}
          <Route path="/trips" element={<MyTrips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/trips/:id/ongoing" element={<TripOngoing />} />
          <Route path="/trips/:id/completed" element={<TripCompleted />} />
          <Route path="/trips/:id/cancel" element={<CancelBooking />} />
          <Route path="/trips/:id/rate" element={<RateReview />} />

          {/* App / common */}
          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatThread />} />
          <Route path="/call/:id" element={<CallScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/states" element={<StatesGallery />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <IncomingCallSheet />
    </Device>
  )
}