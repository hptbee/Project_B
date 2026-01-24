import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/shared/services/api'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import IconChevron from '@/shared/components/ui/IconChevron'
import './OrderDetail.scss'

export default function OrderDetail() {
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

    if (!order) return <div className="page"><header className="page-header"><h2>Chi tiết đơn hàng</h2></header><div className="page-content">Không tìm thấy đơn hàng.</div></div>

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Chi tiết đơn hàng</h2>
            </header>

            <div className="order-detail-container">
                <div className="receipt-card">
                    <div className="receipt-header">
                        <div className="receipt-title">The Coffee Cream</div>
                        <div className="receipt-subtitle">Hóa đơn bán hàng</div>
                    </div>

                    <div className="info-list">
                        <div className="info-row">
                            <span className="label">Mã đơn:</span>
                            <span className="value">#{String(order.id).split('-')[0].toUpperCase()}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Thời gian:</span>
                            <span className="value">{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Hình thức:</span>
                            <span className="value">{order.orderType === 'DINE_IN' ? `Tại bàn ${order.tableNumber}` : 'Mang về'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Trạng thái:</span>
                            <span className="value">{order.status}</span>
                        </div>
                    </div>

                    <div className="items-section">
                        <div className="section-title">Danh sách món</div>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                                <div className="item-main">
                                    <span className="item-name">{item.name} x{item.quantity}</span>
                                    <span className="item-total">{item.total.toLocaleString()} đ</span>
                                </div>
                                <div className="item-meta">
                                    {item.selectedToppings && item.selectedToppings.length > 0 && (
                                        <div className="toppings">
                                            + {item.selectedToppings.map(t => t.name).join(', ')}
                                        </div>
                                    )}
                                    {item.note && <div className="note">Ghi chú: {item.note}</div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="payment-summary">
                        <div className="summary-row">
                            <span className="label">Tạm tính:</span>
                            <span className="val">{order.subTotal.toLocaleString()} đ</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="summary-row">
                                <span className="label">Giảm giá:</span>
                                <span className="val">-{order.discountAmount.toLocaleString()} đ</span>
                            </div>
                        )}
                        <div className="summary-row grand-total">
                            <span className="label">Tổng cộng:</span>
                            <span className="val">{order.total.toLocaleString()} đ</span>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div className="summary-row">
                                <span className="label">Thanh toán:</span>
                                <span className="val">
                                    {order.paymentMethod === 'CASH' ? 'Tiền mặt' :
                                        order.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : 'Kết hợp'}
                                </span>
                            </div>
                            {order.cashAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">Tiền mặt:</span>
                                    <span className="val">{order.cashAmount.toLocaleString()} đ</span>
                                </div>
                            )}
                            {order.transferAmount > 0 && (
                                <div className="summary-row">
                                    <span className="label">Chuyển khoản:</span>
                                    <span className="val">{order.transferAmount.toLocaleString()} đ</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
