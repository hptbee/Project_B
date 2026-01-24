import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTableCart, useTableCartDispatch } from '@/shared/contexts/CartContext'
import ConfirmModal from '@/shared/components/ui/ConfirmModal'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import './Checkout.scss'
import IconChevron from '@/shared/components/ui/IconChevron'

export default function Checkout() {
    const { tableId } = useParams()
    const nav = useNavigate()
    const tableCart = useTableCart(tableId)
    const dispatch = useTableCartDispatch(tableId)
    const [paymentMethod, setPaymentMethod] = useState('CASH') // CASH, TRANSFER, COMBINED
    const [cashAmount, setCashAmount] = useState(0)
    const [transferAmount, setTransferAmount] = useState(0)
    const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null })
    const [loading, setLoading] = useState(false)

    // Discount State
    const [discountType, setDiscountType] = useState('AMOUNT') // AMOUNT, PERCENTAGE
    const [discountValue, setDiscountValue] = useState(0)
    const [showDiscountInput, setShowDiscountInput] = useState(false)

    const subtotal = tableCart.items.reduce(
        (s, i) => s + i.product.price * i.qty + (i.toppings || []).reduce((t, tt) => t + tt.price, 0) * i.qty,
        0
    )

    const discountAmount = discountType === 'PERCENTAGE'
        ? Math.floor((subtotal * discountValue) / 100)
        : discountValue

    const total = Math.max(0, subtotal - discountAmount)

    // Sync amounts based on method
    React.useEffect(() => {
        if (paymentMethod === 'CASH') {
            setCashAmount(total)
            setTransferAmount(0)
        } else if (paymentMethod === 'TRANSFER') {
            setTransferAmount(total)
            setCashAmount(0)
        } else if (paymentMethod === 'COMBINED') {
            // Default to all cash if just switched
            setCashAmount(total)
            setTransferAmount(0)
        }
    }, [paymentMethod, total])

    const handleFinalize = async () => {
        setLoading(true)
        try {
            const orderItems = tableCart.items.map(item => ({
                ProductId: item.product.id,
                Name: item.product.title,
                UnitPrice: item.product.price,
                Quantity: item.qty,
                SelectedToppingNames: (item.toppings || []).map(t => t.title),
                Note: item.note
            }))

            const payload = {
                ClientOrderId: tableCart.clientOrderId,
                OrderType: 'DINE_IN',
                TableNumber: !isNaN(parseInt(tableId)) ? parseInt(tableId) : 0,
                PaymentMethod: paymentMethod,
                CashAmount: paymentMethod === 'COMBINED' ? cashAmount : (paymentMethod === 'CASH' ? total : 0),
                TransferAmount: paymentMethod === 'COMBINED' ? transferAmount : (paymentMethod === 'TRANSFER' ? total : 0),
                Items: orderItems,
                Status: 'SUCCESS',
                Note: tableCart.note,
                DiscountAmount: discountAmount || 0
            }

            const { api } = await import('@/shared/services/api')
            await api.createOrder(payload)

            setModal({
                show: true,
                title: 'Thành công',
                message: 'Thanh toán đơn hàng thành công!',
                onConfirm: () => {
                    dispatch({ type: 'CLEAR_TABLE', payload: { tableId } })
                    nav('/')
                }
            })
        } catch (e) {
            console.error(e)
            setModal({
                show: true,
                title: 'Lỗi thanh toán',
                message: 'Không thể hoàn tất thanh toán: ' + e.message,
                onConfirm: () => setModal({ show: false })
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page checkout-page">
            <header className="page-header checkout-header">
                <button className="back" onClick={() => nav(-1)} aria-label="Quay lại">
                    <IconChevron size={20} />
                </button>
                <div className="checkout-header-title">
                    <div className="title">Thanh toán</div>
                    <div className="subtitle">Bàn {tableId}: {tableCart.orderId}</div>
                </div>
            </header>

            <div className="checkout-content">
                <div className="customer-info-box">
                    <div className="customer-icon">👤</div>
                    <div className="customer-name">Khách lẻ</div>
                </div>

                <div className="order-summary-box">
                    <div className="summary-row">
                        <div className="label">Tổng tiền hàng <span className="items-badge">{tableCart.items.length}</span></div>
                        <div className="value">{subtotal.toLocaleString()}</div>
                    </div>
                    <div
                        className={`summary-row dashed-bottom clickable-row ${showDiscountInput ? 'active' : ''}`}
                        onClick={() => setShowDiscountInput(!showDiscountInput)}
                    >
                        <div className="label">Giảm giá {discountValue > 0 ? `(${discountType === 'PERCENTAGE' ? discountValue + '%' : '✎'})` : '✎'}</div>
                        <div className="value danger">-{discountAmount.toLocaleString()}</div>
                    </div>

                    {showDiscountInput && (
                        <div className="discount-input-area">
                            <div className="type-tabs">
                                <button
                                    className={discountType === 'AMOUNT' ? 'active' : ''}
                                    onClick={(e) => { e.stopPropagation(); setDiscountType('AMOUNT'); }}
                                >
                                    Số tiền
                                </button>
                                <button
                                    className={discountType === 'PERCENTAGE' ? 'active' : ''}
                                    onClick={(e) => { e.stopPropagation(); setDiscountType('PERCENTAGE'); }}
                                >
                                    Phần trăm
                                </button>
                            </div>
                            <div className="input-with-suffix" onClick={e => e.stopPropagation()}>
                                <input
                                    type="number"
                                    value={discountValue}
                                    onChange={e => setDiscountValue(Number(e.target.value))}
                                    autoFocus
                                />
                                <span>{discountType === 'PERCENTAGE' ? '%' : 'đ'}</span>
                            </div>
                        </div>
                    )}

                    <div className="summary-row total-row">
                        <div className="total-label">Khách cần trả</div>
                        <div className="total-value">{total.toLocaleString()}</div>
                    </div>
                </div>

                <h4 className="payment-section-title">Phương thức thanh toán</h4>

                <div className="payment-methods">
                    {/* Payment Options */}
                    {[
                        { id: 'CASH', label: 'Tiền mặt', icon: '💵' },
                        { id: 'TRANSFER', label: 'Chuyển khoản', icon: '🏦' },
                        { id: 'COMBINED', label: 'Kết hợp', icon: '➕' }
                    ].map(method => (
                        <div key={method.id}>
                            <div
                                onClick={() => setPaymentMethod(method.id)}
                                className={`payment-method-item ${paymentMethod === method.id ? 'active' : ''}`}
                            >
                                <span>{method.icon}</span>
                                <div className="label">{method.label}</div>

                                {paymentMethod === method.id && method.id !== 'COMBINED' && (
                                    <div className="payment-numeric-info">
                                        {total.toLocaleString()} đ
                                    </div>
                                )}
                            </div>

                            {paymentMethod === method.id && method.id === 'COMBINED' && (
                                <div className="combined-inputs">
                                    <div className="input-group">
                                        <label>Tiền mặt</label>
                                        <div className="input-with-suffix">
                                            <input
                                                type="number"
                                                value={cashAmount}
                                                onChange={e => {
                                                    const val = Number(e.target.value)
                                                    setCashAmount(val)
                                                    setTransferAmount(Math.max(0, total - val))
                                                }}
                                            />
                                            <span>đ</span>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Chuyển khoản</label>
                                        <div className="input-with-suffix">
                                            <input
                                                type="number"
                                                value={transferAmount}
                                                onChange={e => {
                                                    const val = Number(e.target.value)
                                                    setTransferAmount(val)
                                                    setCashAmount(Math.max(0, total - val))
                                                }}
                                            />
                                            <span>đ</span>
                                        </div>
                                    </div>
                                    {cashAmount + transferAmount !== total && (
                                        <div className="payment-warning">
                                            Tổng tiền ({(cashAmount + transferAmount).toLocaleString()}) chưa khớp với đơn hàng ({total.toLocaleString()})
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="checkout-footer">
                <button
                    onClick={handleFinalize}
                    className="btn-checkout"
                >
                    Thanh toán: {total.toLocaleString()}
                </button>
            </div>

            <ConfirmModal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
                confirmText="Đồng ý"
            />

            {loading && <LoadingSpinner fullScreen />}
        </div>
    )
}
