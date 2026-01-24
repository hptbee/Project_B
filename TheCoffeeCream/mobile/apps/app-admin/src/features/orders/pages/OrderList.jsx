import React, { useState, useEffect, useMemo } from 'react'
import { apiFetch, LoadingSpinner, useToast } from '@thecoffeecream/ui-shared'
import './OrderList.scss'

/**
 * Order Management Page - List view for all transactions
 */
export default function OrderList() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const { showToast } = useToast()

    const fetchOrders = async () => {
        setLoading(true)
        try {
            // Reusing Orders endpoint
            const data = await apiFetch('/Orders')
            setOrders(data)
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            showToast('Không thể tải danh sách đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus
            const matchesSearch = !searchQuery ||
                order.id.toString().includes(searchQuery) ||
                (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchesStatus && matchesSearch
        })
    }, [orders, filterStatus, searchQuery])

    const getStatusLabel = (status) => {
        const labels = {
            'COMPLETED': 'Hoàn thành',
            'PENDING': 'Đang chờ',
            'CANCELLED': 'Đã hủy',
            'DRAFT': 'Nháp'
        }
        return labels[status] || status
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
    }

    return (
        <div className="order-list-page page">
            <header className="page-header">
                <h2>Quản lý đơn hàng</h2>
                <div className="actions">
                    <button className="refresh-btn" onClick={fetchOrders}>
                        ↻ Tải lại
                    </button>
                </div>
            </header>

            <div className="page-content">
                <div className="filter-bar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, khách hàng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="status-filters">
                        <button
                            className={filterStatus === 'ALL' ? 'active' : ''}
                            onClick={() => setFilterStatus('ALL')}
                        >
                            Tất cả
                        </button>
                        <button
                            className={filterStatus === 'PENDING' ? 'active' : ''}
                            onClick={() => setFilterStatus('PENDING')}
                        >
                            Đang chờ
                        </button>
                        <button
                            className={filterStatus === 'COMPLETED' ? 'active' : ''}
                            onClick={() => setFilterStatus('COMPLETED')}
                        >
                            Hoàn thành
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Thời gian</th>
                                    <th>Bàn</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-row">Không tìm thấy đơn hàng nào</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="id-cell">#{order.id}</td>
                                            <td>{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                                            <td>{order.tableName || '-'}</td>
                                            <td className="amount-cell">{formatCurrency(order.totalAmount)}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
