import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/shared/services/api'
import { cacheService, CACHE_KEYS } from '@/shared/services/cache/cacheService'
import { LoadingSpinner, IconChevron, Badge } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@/shared/utils/formatters'
import './OrderHistory.scss'

export default function OrderHistory() {
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

    if (loading && orders.length === 0) return <LoadingSpinner fullScreen message="Đang tải lịch sử..." />

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Lịch sử đơn hàng</h2>
            </header>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-orders">Chưa có đơn hàng nào hôm nay.</div>
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
                                        {order.orderType === 'DINE_IN' ? `Bàn ${order.tableNumber}` : 'Mang về'}
                                    </div>
                                    <div className="order-items-count">{order.items.reduce((sum, it) => sum + (it.quantity ?? it.qty ?? 1), 0)} món</div>
                                </div>
                                <div className="order-total">{formatPrice(order.total, true)}</div>
                            </div>
                            <div className="order-status-line">
                                <div className="payment-method">
                                    {order.paymentMethod === 'CASH' ? '💵 Tiền mặt' :
                                        order.paymentMethod === 'TRANSFER' ? '🏦 Chuyển khoản' : '➕ Kết hợp'}
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
