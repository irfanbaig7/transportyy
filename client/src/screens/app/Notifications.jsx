import { useEffect } from 'react'
import { Bell, IndianRupee, Route as RouteIcon, Star, Gift } from 'lucide-react'
import { Screen, TopBar, EmptyState } from '../../components'
import { useApp } from '../../context/AppContext'

const ICONS = { booking: Bell, payment: IndianRupee, trip: RouteIcon, rating: Star, promo: Gift }

export default function Notifications() {
    const { notifications, markAllNotificationsRead, refreshNotifications } = useApp()
    useEffect(() => {
        refreshNotifications()
        markAllNotificationsRead()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    if (!notifications.length) {
        return (
            <Screen header={<TopBar title="Notifications" />}>
                <EmptyState icon={Bell} title="No notifications" message="You're all caught up!" />
            </Screen>
        )
    }

    return (
        <Screen header={<TopBar title="Notifications" />}>
            <div className="space-y-2">
                {notifications.map((n) => {
                    const Icon = ICONS[n.type] || Bell
                    return (
                        <div key={n._id || n.id} className={`flex gap-3 p-4 rounded-xl border border-line ${n.unread ? 'bg-brand-tint' : 'bg-surface'}`}>                            <span className="h-10 w-10 shrink-0 rounded-full bg-white grid place-items-center"><Icon size={17} className="text-brand" /></span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-ink">{n.title}</p>
                                <p className="text-xs text-muted mt-0.5">{n.body}</p>
                                <p className="text-[10px] text-muted mt-1">{n.time}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Screen>
    )
}