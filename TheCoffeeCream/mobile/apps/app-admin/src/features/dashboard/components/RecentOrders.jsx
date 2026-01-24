import React from 'react'
import './RecentOrders.scss'

export default function RecentOrders({ orders }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="recent-orders">
                <h3 className="section-title">Đơn hàng gần đây</h3>
                <div className="empty-state">Chưa có đơn hàng nào</div>
            </div>
        )
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'COMPLETED': { label: 'Hoàn thành', class: 'success' },
            'PENDING': { label: 'Chờ xử lý', class: 'warning' },
            'CANCELLED': { label: 'Đã hủy', class: 'danger' },
            'DRAFT': { label: 'Nháp', class: 'secondary' }
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
            <h3 className="section-title">Đơn hàng gần đây</h3>
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
