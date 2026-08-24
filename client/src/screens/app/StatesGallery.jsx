import { Screen, TopBar } from '../../components'

const STATES = ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Delhi NCR', 'Tamil Nadu', 'Telangana', 'Punjab']

export default function StatesGallery() {
    return (
        <Screen header={<TopBar title="States We Cover" />}>
            <div className="grid grid-cols-2 gap-3">
                {STATES.map((s) => (
                    <div key={s} className="rounded-2xl bg-surface border border-line p-5 aspect-square flex flex-col items-center justify-center text-center">
                        <span className="h-12 w-12 rounded-xl bg-brand-tint grid place-items-center mb-3 text-brand font-bold">{s[0]}</span>
                        <p className="text-sm font-semibold text-ink">{s}</p>
                    </div>
                ))}
            </div>
        </Screen>
    )
}