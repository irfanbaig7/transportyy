import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Input, Stepper, StickyCTA } from '../../components'

const STEPS = ['Basic Info', 'Car Details', 'Documents', 'Review']

export default function DriverBasicInfo() {
    const navigate = useNavigate()
    return (
        <Screen
            header={<TopBar title="Driver Sign Up" />}
            footer={<StickyCTA><Button full onClick={() => navigate('/driver/car')}>Next</Button></StickyCTA>}
        >
            <Stepper steps={STEPS} current={0} />
            <h2 className="text-xl font-extrabold mt-6">Tell us about yourself</h2>
            <p className="text-sm text-muted mt-1 mb-5">This helps passengers trust you.</p>
            <div className="space-y-4">
                <Input label="Full Name" icon={User} placeholder="Enter your full name" />
                <Input label="Mobile Number" icon={Phone} type="tel" placeholder="+91 98765 43210" />
                <Input label="Email" icon={Mail} type="email" placeholder="Enter your email" />
                <Input label="City" icon={MapPin} placeholder="Enter your city" />
            </div>
        </Screen>
    )
}