import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ordersApi as api } from '@thecoffeecream/ui-shared'
import { LoadingSpinner, IconChevron, Badge, useTranslation } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './OrderDetail.scss'

export default function OrderDetail() {
    const { t } = useTranslation()
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await api.getOrder(id)
                setOrder(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    if (loading) return <LoadingSpinner fullScreen message="Đang tải chi tiết..." />

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
                                    <span className="item-name">{item.name} x{item.quantity}</span>
                                    <span className="item-total">{formatPrice(item.total, true)}</span>
                                </div>
                                <div className="item-meta">
                                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                                        <div className="toppings">
                                            + {item.selectedToppings.map(t => t.name).join(', ')}
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

                        <div style={{ marginTop: 12 }}>
                            <div className="summary-row">
                                <span className="label">{t('common.payment')}:</span>
                                <span className="val">
                                    {order.paymentMethod === 'CASH' ? `💵 ${t('common.cash')}` :
                                        order.paymentMethod === 'TRANSFER' ? `🏦 ${t('common.transfer')}` : `➕ ${t('common.mixed')}`}
                                </span>
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
        </div>
    )
}
