import { Check } from 'lucide-react'

// steps: array of short labels. current: 0-based active index.
export default function Stepper({ steps = [], current = 0 }) {
  return (
    <div className="flex items-start">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <span
                className={`absolute top-3.5 -left-1/2 right-1/2 h-0.5 ${i <= current ? 'bg-brand' : 'bg-line'}`}
              />
            )}
            <span
              className={`relative z-10 h-7 w-7 rounded-full grid place-items-center text-xs font-bold transition ${
                done
                  ? 'bg-brand text-white'
                  : active
                  ? 'bg-brand text-white ring-4 ring-brand-light'
                  : 'bg-line text-muted'
              }`}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span
              className={`mt-1.5 text-[10px] text-center leading-tight ${
                active || done ? 'text-ink font-semibold' : 'text-muted'
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
