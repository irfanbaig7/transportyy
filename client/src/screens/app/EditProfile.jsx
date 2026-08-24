import { useNavigate } from 'react-router-dom'
import { User, Phone, Mail, MapPin } from 'lucide-react'
import { Screen, TopBar, Button, Input, Avatar, StickyCTA } from '../../components'
import { useApp } from '../../context/AppContext'

export default function EditProfile() {
    const navigate = useNavigate()
    const { user, updateUser } = useApp()

    const submit = (e) => {
        e.preventDefault()
        navigate('/profile')
    }

    return (
        <Screen
            header={<TopBar title="Edit Profile" />}
            footer={<StickyCTA><Button full onClick={submit}>Save Changes</Button></StickyCTA>}
        >
            <div className="flex justify-center mb-6">
                <Avatar name={user.name} size="xl" />
            </div>
            <form onSubmit={submit} className="space-y-4">
                <Input label="Full Name" icon={User} defaultValue={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
                <Input label="Mobile Number" icon={Phone} defaultValue={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} />
                <Input label="Email" icon={Mail} defaultValue={user.email} onChange={(e) => updateUser({ email: e.target.value })} />
                <Input label="City" icon={MapPin} defaultValue={user.city} onChange={(e) => updateUser({ city: e.target.value })} />
            </form>
        </Screen>
    )
}