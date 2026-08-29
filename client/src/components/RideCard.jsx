import { Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import Badge from './Badge'

export default function RideCard({ ride, to }) {
  const driver = ride.driver || {}
  const car = driver.car || ride.car || {}

  const card = (
    <div className="bg-surface rounded-2xl border border-line p-4 shadow-[var(--shadow-card)] active:scale-[0.99] transition">
      <div className="flex items-center gap-3">
        <Avatar name={driver.name || 'Driver'} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-ink truncate">{driver.name || 'Driver'}</p>
            {driver.ratingCount > 0 ? (
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {driver.rating?.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted">New</span>
            )}
          </div>
          <p className="text-xs text-muted truncate">
            {car.brand || 'Car'} {car.number ? `· ${car.number}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-ink">₹{ride.price}</p>
          <p className="text-[10px] text-muted">per seat</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="font-semibold text-ink">{ride.time}</span>
        <span className="text-muted">·</span>
        <span className="text-body truncate">
          {ride.from} → {ride.to}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <Badge tone="green" icon={Users}>
          {ride.seatsAvailable} seats
        </Badge>
        {car.ac && <Badge tone="gray">AC</Badge>}
        {ride.distanceAway && <span className="ml-auto text-xs text-muted">{ride.distanceAway} away</span>}
      </div>
    </div>
  )

  return to ? (
    <Link to={to} className="block tap">
      {card}
    </Link>
  ) : (
    card
  )
}