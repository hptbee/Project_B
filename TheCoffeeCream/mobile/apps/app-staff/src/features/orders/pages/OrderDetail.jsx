import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ordersApi as api } from '@thecoffeecream/ui-shared'
import { LoadingSpinner, IconChevron, Badge, useTranslation, Icon } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './OrderDetail.scss'

export default function OrderDetail() {
    const { t } = useTranslation()
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    // Edit Payment State
    const [showEditPayment, setShowEditPayment] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editMethod, setEditMethod] = useState('CASH')
    const [editCash, setEditCash] = useState(0)
    const [editTransfer, setEditTransfer] = useState(0)
    const [editError, setEditError] = useState('')

    useEffect(() => {
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const data = await api.getOrder(id)
            setOrder(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenEditPayment = () => {
        setEditMethod(order.paymentMethod)
        setEditCash(order.cashAmount)
        setEditTransfer(order.transferAmount)
        setEditError('')
        setSaving(false)
        setShowEditPayment(true)
    }

    const handleSavePayment = async () => {
        setEditError('')
        const total = order.total

        if (editMethod === 'COMBINED') {
            const sum = Number(editCash) + Number(editTransfer)
            if (Math.abs(sum - total) > 100) { // Tolerance 100 VND
                setEditError(`Tổng tiền (Cash + Transfer) phải bằng ${formatPrice(total)}`)
                return
            }
        }

        try {
            setSaving(true)
            await api.updatePaymentMethod(order.id, {
                paymentMethod: editMethod,
                cashAmount: Number(editCash),
                transferAmount: Number(editTransfer)
            })
            setShowEditPayment(false)
            fetchOrder() // Refresh
        } catch (err) {
            console.error(err)
            setEditError('Có lỗi xảy ra khi cập nhật')
        } finally {
            setSaving(false)
        }
    }

    if (loading && !order) return <LoadingSpinner fullScreen message="Đang tải chi tiết..." />

    if (!order) return (
        <div className="page">
            <header className="page-header">
                <button className="back icon-btn" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Chi tiết đơn hàng</h2>
            </header>
            <div className="page-content">{t('common.no_data')}</div>
        </div>
    )

    return (
        <div className="page">
            {/* ... Header and Content ... */}
            <header className="page-header">
                <button className="back icon-btn" onClick={() => navigate(-1)} aria-label={t('action.cancel')}>
                    <IconChevron variant="bold" />
                </button>
                <h2>{t('common.order_detail')}</h2>
            </header>

            <div className="order-detail-container">
                <div className="receipt-card">
                    <div className="receipt-header">
                        <div className="receipt-title">The Coffee Cream</div>
                        <div className="receipt-subtitle">{t('common.receipt_title')}</div>
                    </div>

                    <div className="info-list">
                        <div className="info-row">
                            <span className="label">{t('common.code')}:</span>
                            <span className="value">#{String(order.id).split('-')[0].toUpperCase()}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">{t('common.time')}:</span>
                            <span className="value">{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">{t('common.type')}:</span>
                            <Badge variant="info" size="sm">
                                {order.orderType === 'DINE_IN' ? `${t('common.table')} ${order.tableNumber}` : t('pos.takeaway')}
                            </Badge>
                        </div>
                        <div className="info-row">
                            <span className="label">{t('common.status')}:</span>
                            <Badge variant={order.status === 'SUCCESS' ? 'success' : 'warning'} size="sm">
                                {order.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="items-section">
                        <div className="section-title">{t('common.items_list')}</div>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                                <div className="item-main">
                                    <span className="item-name">
                                        {item.name}
                                        <span className="unit-price-hint"> ({formatPrice(item.unitPrice)})</span>
                                        <span className="qty-x"> x{item.quantity}</span>
                                    </span>
                                    <span className="item-total">{formatPrice(item.total, true)}</span>
                                </div>
                                <div className="item-meta">
                                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                                        <div className="toppings">
                                            + {item.selectedToppings.map(t => `${t.name} (${formatPrice(t.price)})`).join(', ')}
                                        </div>
                                    )}
                                    {item.note && <div className="note">{t('common.note')}: {item.note}</div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="payment-summary">
                        <div className="summary-row">
                            <span className="label">{t('common.subtotal')}:</span>
                            <span className="val">{formatPrice(order.subTotal, true)}</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="summary-row">
                                <span className="label">{t('common.discount')}:</span>
                                <span className="val">-{formatPrice(order.discountAmount, true)}</span>
                            </div>
                        )}
                        <div className="summary-row grand-total">
                            <span className="label">{t('common.grand_total')}:</span>
                            <span className="val">{formatPrice(order.total, true)}</span>
                        </div>

                        <div className="payment-breakdown">
                            <div className="summary-row">
                                <span className="label">{t('common.payment')}:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="val">
                                        {order.paymentMethod === 'CASH' ? `💵 ${t('common.cash')}` :
                                            order.paymentMethod === 'TRANSFER' ? `🏦 ${t('common.transfer')}` : `➕ ${t('common.mixed')}`}
                                    </span>
                                    <button
                                        onClick={handleOpenEditPayment}
                                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-muted)' }}
                                    >
                                        <Icon name="edit" size={16} />
                                    </button>
                                </div>
                            </div>
                            {order.cashAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">{t('common.cash')}:</span>
                                    <span className="val">{formatPrice(order.cashAmount, true)}</span>
                                </div>
                            )}
                            {order.transferAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">{t('common.transfer')}:</span>
                                    <span className="val">{formatPrice(order.transferAmount, true)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Payment Modal */}
            {showEditPayment && (
                <div className="payment-modal-overlay" onClick={() => setShowEditPayment(false)}>
                    <div className="payment-modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Cập nhật thanh toán</span>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Hình thức thanh toán</label>
                                <select
                                    value={editMethod}
                                    onChange={e => {
                                        const newMethod = e.target.value;
                                        setEditMethod(newMethod);
                                        // Auto-fill amounts for UX
                                        if (newMethod === 'CASH') {
                                            setEditCash(order.total);
                                            setEditTransfer(0);
                                        } else if (newMethod === 'TRANSFER') {
                                            setEditTransfer(order.total);
                                            setEditCash(0);
                                        }
                                        // For COMBINED, keep existing or let user type
                                    }}
                                >
                                    <option value="CASH">Tiền mặt</option>
                                    <option value="TRANSFER">Chuyển khoản</option>
                                    <option value="COMBINED">Kết hợp</option>
                                </select>
                            </div>

                            {editMethod === 'COMBINED' && (
                                <>
                                    <div className="form-group">
                                        <label>Tiền mặt</label>
                                        <input
                                            type="number"
                                            value={editCash}
                                            onChange={e => {
                                                const val = e.target.value
                                                setEditCash(val)
                                                // Auto-calculate transfer
                                                if (val && !isNaN(val)) {
                                                    setEditTransfer(Math.max(0, order.total - Number(val)))
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Chuyển khoản</label>
                                        <input
                                            type="number"
                                            value={editTransfer}
                                            onChange={e => {
                                                const val = e.target.value
                                                setEditTransfer(val)
                                                // Auto-calculate cash
                                                if (val && !isNaN(val)) {
                                                    setEditCash(Math.max(0, order.total - Number(val)))
                                                }
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {editError && <div style={{ color: 'var(--danger-color, red)', fontSize: '13px', marginTop: '8px' }}>{editError}</div>}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowEditPayment(false)} disabled={saving}>
                                Hủy
                            </button>
                            <button className="btn-primary" onClick={handleSavePayment} disabled={saving}>
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
