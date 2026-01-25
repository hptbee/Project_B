import { useState, useEffect, useMemo } from 'react'
import { Icon, useToast, LoadingSpinner, Badge, DateRangePicker, ConfirmModal, useTranslation, SearchBar, Pagination, ordersApi as orderApi, reportsApi as reportApi } from '@thecoffeecream/ui-shared'
import OrderEditModal from '../components/OrderEditModal'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './OrderList.scss'

/**
 * Order Management Page - List view for all transactions
 */
export default function OrderList() {
    const { t } = useTranslation()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    })
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState({ show: false, order: null })
    const { showToast } = useToast()

    // Pagination & Sorting State
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const data = await orderApi.getOrders(dateRange.start, dateRange.end)
            setOrders(data)
        } catch (err) { // eslint-disable-line no-unused-vars
            showToast(t('modal.load_orders_error'), 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (order) => {
        setConfirmDelete({ show: true, order })
    }

    const executeDelete = async () => {
        const { order } = confirmDelete
        try {
            await orderApi.deleteOrder(order.id)
            showToast(t('modal.delete_order_success'))
            fetchOrders()
        } catch (err) { // eslint-disable-line no-unused-vars
            showToast(t('modal.delete_order_error'), 'error')
        } finally {
            setConfirmDelete({ show: false, order: null })
        }
    }

    const handleExport = async () => {
        try {
            showToast(t('modal.export_loading'))
            const blob = await reportApi.exportCsv(dateRange.start, dateRange.end)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `orders_${dateRange.start}_${dateRange.end}.csv`
            a.click()
        } catch (err) { // eslint-disable-line no-unused-vars
            showToast(t('modal.export_error'), 'error')
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [dateRange])

    const filteredAndSortedOrders = useMemo(() => {
        let result = orders.filter(order => {
            const statusMatch = filterStatus === 'ALL' ||
                (order.status && order.status.toUpperCase() === filterStatus.toUpperCase())

            const searchMatch = !searchQuery ||
                order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))

            return statusMatch && searchMatch
        })

        // Sort
        result.sort((a, b) => {
            const valA = a[sortConfig.key]
            const valB = b[sortConfig.key]

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [orders, filterStatus, searchQuery, sortConfig])

    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredAndSortedOrders.slice(start, start + itemsPerPage)
    }, [filteredAndSortedOrders, currentPage, itemsPerPage])

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <Icon name="chevron-down" size={12} className="sort-icon-inactive" />
        return sortConfig.direction === 'asc'
            ? <Icon name="chevron-up" size={12} color="var(--accent-amber)" />
            : <Icon name="chevron-down" size={12} color="var(--accent-amber)" />
    }

    const getStatusLabel = (status) => {
        const labels = {
            'SUCCESS': t('status.paid'),
            'PENDING': t('status.pending'),
            'REMOVED': t('status.removed'),
            'DRAFT': t('status.draft')
        }
        return labels[status.toUpperCase()] || status
    }

    // const formatCurrency = (val) => {
    //     return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
    // }

    if (loading && orders.length === 0) {
        return <LoadingSpinner fullScreen />
    }

    return (
        <div className="order-list-page page">
            <header className="page-header">
                <div className="title-section">
                    <p className="subtitle">{t('report.orders')}: {filteredAndSortedOrders.length}</p>
                </div>
                <div className="header-actions">
                    <button className="refresh-btn" onClick={fetchOrders} title={t('action.refresh')}>
                        <Icon name="sync" size={18} />
                    </button>
                    <button className="export-btn" onClick={handleExport}>
                        <Icon name="download" size={16} /> <span className="desktop-only">{t('action.export')}</span>
                    </button>
                </div>
            </header>

            <div className="page-content">
                <div className="filter-bar-v2">
                    <div className="search-and-status">
                        <div className="search-box-wrapper">
                            <SearchBar
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('common.search')}
                            />
                        </div>
                        <div className="status-tabs">
                            {['ALL', 'SUCCESS', 'PENDING', 'REMOVED'].map(s => (
                                <button
                                    key={s}
                                    className={`status-tab ${filterStatus === s ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(s)}
                                >
                                    {s === 'ALL' ? t('common.all') : getStatusLabel(s)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="date-filters-v2">
                        <DateRangePicker
                            start={dateRange.start}
                            end={dateRange.end}
                            onApply={(range) => {
                                const start = range.start.toISOString().split('T')[0]
                                const end = range.end.toISOString().split('T')[0]
                                setDateRange({ start, end })
                            }}
                        />
                    </div>
                </div>

                <div className="orders-container">
                    {/* Desktop Table */}
                    <div className="orders-table-wrapper glass-card desktop-only">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th className="sortable" onClick={() => requestSort('createdAt')}>
                                        Thời gian {getSortIcon('createdAt')}
                                    </th>
                                    <th className="sortable" onClick={() => requestSort('id')}>
                                        {t('common.code')} {getSortIcon('id')}
                                    </th>
                                    <th>{t('common.table')}</th>
                                    <th>{t('common.payment_method')}</th>
                                    <th className="text-right sortable" onClick={() => requestSort('total')}>
                                        {t('report.revenue')} {getSortIcon('total')}
                                    </th>
                                    <th>{t('common.status')}</th>
                                    <th className="text-right">{t('common.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="empty-row">{t('modal.no_orders_found')}</td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map(order => (
                                        <tr key={order.id} className={order.status === 'REMOVED' ? 'is-removed' : ''}>
                                            <td className="time-cell">{new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                                            <td className="id-cell">#{order.id.split('-')[0]}</td>
                                            <td>{order.tableNumber ? `${t('common.table')} ${order.tableNumber}` : t('pos.takeaway')}</td>
                                            <td>
                                                <Badge variant="ghost" size="xs">
                                                    {order.paymentMethod === 'CASH' ? t('common.cash') : (order.paymentMethod === 'TRANSFER' ? t('common.transfer') : t('common.mixed'))}
                                                </Badge>
                                            </td>
                                            <td className="amount-cell text-right">{formatPrice(order.total, true)}</td>
                                            <td>
                                                <Badge variant={order.status === 'SUCCESS' ? 'success' : (order.status === 'PENDING' ? 'warning' : 'draft')} size="xs">
                                                    {getStatusLabel(order.status)}
                                                </Badge>
                                            </td>
                                            <td className="text-right">
                                                <div className="actions">
                                                    <button
                                                        className="icon-btn"
                                                        title={t('modal.view_edit')}
                                                        onClick={() => {
                                                            setSelectedOrder(order)
                                                            setShowEditModal(true)
                                                        }}
                                                    >
                                                        <Icon name="edit" size={16} />
                                                    </button>
                                                    {order.status !== 'REMOVED' && (
                                                        <button className="icon-btn danger" onClick={() => handleDelete(order)} title={t('action.delete')}>
                                                            <Icon name="trash" size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Grid */}
                    <div className="orders-mobile-grid mobile-only">
                        {/* Mobile Sort Controls */}
                        <div className="mobile-sort-bar">
                            <button
                                className={`sort-btn ${sortConfig.key === 'createdAt' ? 'active' : ''}`}
                                onClick={() => requestSort('createdAt')}
                            >
                                <Icon name="clock" size={14} />
                                {t('common.time')} {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                className={`sort-btn ${sortConfig.key === 'total' ? 'active' : ''}`}
                                onClick={() => requestSort('total')}
                            >
                                <Icon name="dollar-sign" size={14} />
                                {t('report.revenue')} {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>

                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map(order => (
                                <div key={order.id} className={`order-mobile-card glass-card ${order.status === 'REMOVED' ? 'is-removed' : ''}`} onClick={() => { setSelectedOrder(order); setShowEditModal(true); }}>
                                    <div className="card-header">
                                        <div className="order-id">#{order.id.split('-')[0]}</div>
                                        <Badge variant={order.status === 'SUCCESS' ? 'success' : (order.status === 'PENDING' ? 'warning' : 'draft')} size="xs">
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </div>
                                    <div className="card-body">
                                        <div className="info-row">
                                            <div className="info-item">
                                                <Icon name="home" size={12} />
                                                <span>{order.tableNumber ? `${t('common.table')} ${order.tableNumber}` : t('pos.takeaway')}</span>
                                            </div>
                                            <div className="info-item">
                                                <Icon name="coffee" size={12} />
                                                <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('pos.qty').toLowerCase()}</span>
                                            </div>
                                            <div className="info-item full-width">
                                                <Icon name="clock" size={12} />
                                                <span>{new Date(order.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <div className="payment-row">
                                            <Badge variant="ghost" size="xs">
                                                {order.paymentMethod === 'CASH' ? t('common.cash') : (order.paymentMethod === 'TRANSFER' ? t('common.transfer') : t('common.mixed'))}
                                            </Badge>
                                            <div className="total">{formatPrice(order.total, true)}</div>
                                        </div>
                                    </div>
                                    <div className="card-arrow">
                                        <Icon name="chevronRight" size={16} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-mobile">{t('modal.no_orders_found')}</div>
                        )}
                    </div>

                    <Pagination
                        totalItems={filteredAndSortedOrders.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {showEditModal && selectedOrder && (
                <OrderEditModal
                    order={selectedOrder}
                    onClose={() => setShowEditModal(false)}
                    onSave={() => {
                        setShowEditModal(false)
                        fetchOrders()
                    }}
                />
            )}

            <ConfirmModal
                show={confirmDelete.show}
                title={t('modal.confirm_delete_order_title')}
                message={t('modal.confirm_delete_order_msg', { id: confirmDelete.order?.id.split('-')[0] })}
                onConfirm={executeDelete}
                onCancel={() => setConfirmDelete({ show: false, order: null })}
                confirmText={t('modal.confirm_delete_btn')}
                type="danger"
            />
        </div>
    )
}
