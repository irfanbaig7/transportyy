import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Car, ShieldCheck, Compass } from 'lucide-react'
import { Button } from '../components'

const slides = [
    { icon: Compass, title1: 'Open Rides,', title2: 'Real Connections', text: "A community platform that connects travelers with drivers who are going the same way." },
    { icon: Users, title1: 'Share Your Ride,', title2: 'Earn & Help Others', text: "If you're driving somewhere, list your trip and offer seats. Earn, save fuel, and build trust in the community." },
    { icon: ShieldCheck, title1: 'Book with Confidence,', title2: 'Travel Safely', text: "View driver details, ratings, car info and route before you book. Confirm and travel with peace of mind." },
    { icon: Car, title1: "You're in", title2: 'Control', text: 'Choose your route, list your car, confirm bookings — safe, flexible and community-driven.' },
]

export default function Onboarding() {
    const [i, setI] = useState(0)
    const navigate = useNavigate()
    const slide = slides[i]
    const Icon = slide.icon
    const last = i === slides.length - 1

    const next = () => (last ? navigate('/role') : setI((v) => v + 1))
    const skip = () => navigate('/role')

    return (
        <div className="flex flex-col h-full px-6 pt-6 pb-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="h-56 w-56 rounded-[2rem] bg-brand-tint grid place-items-center mb-8">
                    <Icon size={72} className="text-brand" strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-extrabold leading-tight">
                    {slide.title1} <span className="text-brand">{slide.title2}</span>
                </h1>
                <p className="mt-3 text-sm text-muted max-w-[280px]">{slide.text}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-6">
                {slides.map((_, d) => (
                    <span key={d} className={`h-1.5 rounded-full transition-all ${d === i ? 'w-6 bg-brand' : 'w-1.5 bg-line'}`} />
                ))}
            </div>
            <Button full onClick={next}>{last ? 'Get Started' : 'Next'}</Button>
            <button onClick={skip} className="tap mt-3 text-sm font-medium text-muted mx-auto">Skip</button>
        </div>
    )
}