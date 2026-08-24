import { useNavigate } from 'react-router-dom'
import { Screen, TopBar, Button, Toggle, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

const SORTS = [
    { id: 'best', label: 'Best Match' },
    { id: 'price', label: 'Lowest Price' },
    { id: 'time', label: 'Earliest Departure' },
    { id: 'rating', label: 'Top Rated' },
]

export default function SearchFilters() {
    const navigate = useNavigate()
    const { filters, setFilters } = useApp()

    return (
        <Screen
            header={<TopBar title="Filters" />}
            footer={<StickyCTA><Button full onClick={() => navigate(-1)}>Apply Filters</Button></StickyCTA>}
        >
            <p className="text-sm font-bold text-ink mb-2">Sort by</p>
            <div className="space-y-2 mb-6">
                {SORTS.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setFilters({ sort: s.id })}
                        className={`tap w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium ${filters.sort === s.id ? 'border-brand bg-brand-tint text-brand-darker' : 'border-line bg-surface text-ink'
                            }`}
                    >
                        {s.label}
                        <span className={`h-4 w-4 rounded-full border-2 ${filters.sort === s.id ? 'border-brand bg-brand' : 'border-line'}`} />
                    </button>
                ))}
            </div>

            <p className="text-sm font-bold text-ink mb-2">Max Price: ₹{filters.maxPrice}</p>
            <input
                type="range" min="200" max="1500" step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ maxPrice: Number(e.target.value) })}
                className="w-full accent-[var(--color-brand)] mb-6"
            />

            <div className="space-y-4">
                <Toggle label="AC Only" checked={filters.ac} onChange={(v) => setFilters({ ac: v })} />
                <Toggle label="Verified Drivers Only" checked={filters.verifiedOnly} onChange={(v) => setFilters({ verifiedOnly: v })} />
            </div>
        </Screen>
    )
}