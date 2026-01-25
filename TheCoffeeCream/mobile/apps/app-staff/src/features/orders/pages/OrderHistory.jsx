import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingSpinner, IconChevron, Badge, useTranslation, formatPrice, cacheService, CACHE_KEYS, ordersApi as api, EmptyState } from '@thecoffeecream/ui-shared'
import './OrderHistory.scss'

export default function OrderHistory() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const paramDate = searchParams.get('date')
    const paramStatus = searchParams.get('status')

    useEffect(() => {
        const fetchOrders = async () => {
            const localDate = new Date().toLocaleDateString('en-CA')
            const targetDate = paramDate || localDate
            const isToday = targetDate === localDate

            try {
                // 1. Check cache for today
                if (isToday) {
                    const cached = cacheService.get(CACHE_KEYS.ORDERS)
                    if (cached) {
                        setOrders(cached)
                        setLoading(false)
                    }
                } else {
                    setLoading(true)
                }

                // 2. Background Fetch
                const data = await api.getOrders(targetDate, null)
                let filteredData = data || []
                if (paramStatus) {
                    filteredData = filteredData.filter(o => o.status === paramStatus)
                }

                setOrders(filteredData)
                if (isToday) cacheService.set(CACHE_KEYS.ORDERS, filteredData, 15 * 60 * 1000) // 15m cache
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [paramDate, paramStatus])

    const formatTime = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    if (loading && orders.length === 0) return <LoadingSpinner fullScreen message={t('common.loading')} />

    return (
        <div className="page">
            <header className="page-header">
                <button className="back icon-btn" onClick={() => navigate(-1)} aria-label={t('action.cancel')}>
                    <IconChevron variant="bold" />
                </button>
                <h2>{t('common.order_history')}</h2>
            </header>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <EmptyState
                        icon="history"
                        title={t('common.no_orders_today')}
                        subtitle="Hãy hoàn thành đơn hàng đầu tiên trong ngày nhé!"
                    />
                ) : (
                    orders.map(order => (
                        <div
                            key={order.id}
                            className="order-history-card"
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            <div className="order-head">
                                <span className="order-id">#{String(order.id).split('-')[0].toUpperCase()}</span>
                                <span className="order-time">{formatTime(order.createdAt)}</span>
                            </div>
                            <div className="order-body">
                                <div className="order-info">
                                    <div className="order-type">
                                        {order.orderType === 'DINE_IN' ? `${t('common.table')} ${order.tableNumber}` : t('pos.takeaway')}
                                    </div>
                                    <div className="order-items-count">{order.items.reduce((sum, it) => sum + (it.quantity ?? it.qty ?? 1), 0)} {t('pos.qty')}</div>
                                </div>
                                <div className="order-total">{formatPrice(order.total, true)}</div>
                            </div>
                            <div className="order-status-line">
                                <div className="payment-method">
                                    {order.paymentMethod === 'CASH' ? `💵 ${t('common.cash')}` :
                                        order.paymentMethod === 'TRANSFER' ? `🏦 ${t('common.transfer')}` : `➕ ${t('common.mixed')}`}
                                </div>
                                <Badge
                                    variant={order.status === 'SUCCESS' ? 'success' : order.status === 'DRAFT' ? 'warning' : 'danger'}
                                    size="sm"
                                >
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
