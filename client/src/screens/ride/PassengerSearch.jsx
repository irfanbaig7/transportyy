import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, SlidersHorizontal, Users, Search } from 'lucide-react'
import { Screen, TopBar, RideCard, EmptyState, Spinner } from '../../components'
import { useApp } from '../../context/AppContext'

function parseTimeToday(timeStr) {
    if (!timeStr) return 0
    const t = Date.parse(`${new Date().toDateString()} ${timeStr}`)
    return Number.isNaN(t) ? 0 : t
}

export default function PassengerSearch() {
    const navigate = useNavigate()
    
    const { search, setSearch, rides, searchRides, loading, filters, socket } = useApp()

    // existing searchRides useEffect ke baad ADD KARO:
    useEffect(() => {
        if (!socket) return
        const refetch = () => searchRides({ from: search.from, to: search.to })
        socket.on('ride:posted', refetch)
        socket.on('ride:updated', refetch)
        return () => {
            socket.off('ride:posted', refetch)
            socket.off('ride:updated', refetch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, search.from, search.to])

    const [editing, setEditing] = useState(!search.from && !search.to)
    const [form, setForm] = useState({ from: search.from || '', to: search.to || '' })

    useEffect(() => {
        searchRides({ from: search.from, to: search.to })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.from, search.to])

    const runSearch = () => {
        setSearch({ from: form.from, to: form.to })
        setEditing(false)
    }

    // Apply the filters/sort chosen on the Filters screen client-side —
    // the search API only narrows by route, this narrows/orders the result.
    const visibleRides = useMemo(() => {
        let list = rides.filter((r) => {
            if (filters.maxPrice && r.price > filters.maxPrice) return false
            if (filters.ac && !(r.driver?.car?.ac)) return false
            if (filters.verifiedOnly && !r.driver?.verified) return false
            if (filters.seats && r.seatsAvailable < filters.seats) return false
            return true
        })

        if (filters.sort === 'price') list = [...list].sort((a, b) => a.price - b.price)
        else if (filters.sort === 'rating') list = [...list].sort((a, b) => (b.driver?.rating || 0) - (a.driver?.rating || 0))
        else if (filters.sort === 'time') list = [...list].sort((a, b) => parseTimeToday(a.time) - parseTimeToday(b.time))

        return list
    }, [rides, filters])

    return (
        <Screen header={<TopBar title="Find a Ride" />} padded={false}>
            <div className="px-5 pt-4 pb-3 bg-surface border-b border-line">
                {editing ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5">
                            <MapPin size={15} className="text-brand shrink-0" />
                            <input
                                value={form.from}
                                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                                placeholder="From (e.g. Pune) — leave blank for all"
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-muted"
                            />
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5">
                            <MapPin size={15} className="text-brand shrink-0" />
                            <input
                                value={form.to}
                                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                                placeholder="To (e.g. Nagpur) — leave blank for all"
                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-ink placeholder:text-muted"
                            />
                        </div>
                        <button
                            onClick={runSearch}
                            className="tap w-full h-11 rounded-xl bg-brand text-white text-sm font-semibold flex items-center justify-center gap-2"
                        >
                            <Search size={16} /> Search Rides
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink truncate">
                            <MapPin size={15} className="text-brand shrink-0" />
                            {search.from || 'Anywhere'} → {search.to || 'Anywhere'}
                        </div>
                        <button
                            onClick={() => { setForm({ from: search.from, to: search.to }); setEditing(true) }}
                            className="tap text-xs font-semibold text-brand shrink-0 ml-2"
                        >
                            Edit Search
                        </button>
                    </div>
                )}
            </div>

            <div className="px-5 py-4 space-y-3 overflow-y-auto no-scrollbar flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Matching Rides</p>
                    <Link to="/filters" className="tap flex items-center gap-1.5 text-xs font-semibold text-muted">
                        <SlidersHorizontal size={14} /> Filters
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><Spinner size={28} /></div>
                ) : visibleRides.length ? (
                    visibleRides.map((r) => <RideCard key={r._id || r.id} ride={r} to={`/ride/${r._id || r.id}`} />)
                ) : (
                    <EmptyState
                        icon={Users}
                        title="No rides found"
                        message="Try a different route, or loosen your filters."
                    />
                )}
            </div>
        </Screen>
    )
}