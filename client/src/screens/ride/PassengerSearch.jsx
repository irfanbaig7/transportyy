import { Link, useNavigate } from 'react-router-dom'
import { MapPin, SlidersHorizontal, Users } from 'lucide-react'
import { Screen, TopBar, RideCard, EmptyState } from '../../components'
import { useApp } from '../../context/AppContext'

export default function PassengerSearch() {
    const navigate = useNavigate()
    const { search, rides } = useApp()

    return (
        <Screen header={<TopBar title="Find a Ride" />} padded={false}>
            <div className="px-5 pt-4 pb-3 bg-surface border-b border-line">
                <div className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                        <MapPin size={15} className="text-brand" />
                        {search.from} → {search.to}
                        <span className="text-muted font-normal">· {search.passengers} Passenger</span>
                    </div>
                    <button onClick={() => navigate(-1)} className="tap text-xs font-semibold text-brand">Edit Search</button>
                </div>
            </div>

            <div className="px-5 py-4 space-y-3 overflow-y-auto no-scrollbar flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Matching Rides</p>
                    <Link to="/filters" className="tap flex items-center gap-1.5 text-xs font-semibold text-muted">
                        <SlidersHorizontal size={14} /> Filters
                    </Link>
                </div>
                {rides.length ? (
                    rides.map((r) => <RideCard key={r.id} ride={r} to={`/ride/${r.id}`} />)
                ) : (
                    <EmptyState icon={Users} title="No rides found" message="Try adjusting your search or filters." />
                )}
            </div>
        </Screen>
    )
}