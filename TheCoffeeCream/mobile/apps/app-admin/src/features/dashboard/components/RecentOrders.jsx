import { useTranslation } from '@thecoffeecream/ui-shared'
import './RecentOrders.scss'

export default function RecentOrders({ orders }) {
    const { t } = useTranslation()

    if (!orders || orders.length === 0) {
        return (
            <div className="recent-orders">
                <h3 className="section-title">{t('dashboard.recent_orders')}</h3>
                <div className="empty-state">{t('dashboard.no_orders')}</div>
            </div>
        )
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'COMPLETED': { label: t('status.completed'), class: 'success' },
            'PENDING': { label: t('status.pending'), class: 'warning' },
            'CANCELLED': { label: t('status.cancelled'), class: 'danger' },
            'DRAFT': { label: t('status.draft'), class: 'secondary' }
        }
        return statusMap[status] || { label: status, class: 'secondary' }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value)
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="recent-orders">
            <h3 className="section-title">{t('dashboard.recent_orders')}</h3>
            <div className="orders-list">
                {orders.map((order) => {
                    const badge = getStatusBadge(order.status)
                    return (
                        <div key={order.id} className="order-item">
                            <div className="order-header">
                                <span className="order-id">#{order.id}</span>
                                <span className={`order-status badge-${badge.class}`}>
                                    {badge.label}
                                </span>
                            </div>
                            <div className="order-details">
                                <span className="order-time">{formatTime(order.createdAt)}</span>
                                <span className="order-amount">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
