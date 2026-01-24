import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTableCart, useTableCartDispatch } from '@/shared/contexts/CartContext'
import { calculateCartTotal, calculateDiscount, calculateTotal } from '@/shared/utils/calculations'
import { formatPrice } from '@/shared/utils/formatters'
import { ConfirmModal, LoadingSpinner, IconChevron } from '@thecoffeecream/ui-shared'
import './Checkout.scss'

export default function Checkout() {
    const { tableId } = useParams()
    const nav = useNavigate()
    const tableCart = useTableCart(tableId)
    const dispatch = useTableCartDispatch(tableId)

    // UI State
    const [paymentMethod, setPaymentMethod] = useState('CASH') // CASH, TRANSFER, COMBINED
    const [cashAmount, setCashAmount] = useState(0)
    const [transferAmount, setTransferAmount] = useState(0)
    const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null })
    const [loading, setLoading] = useState(false)

    // Discount State
    const [discountType, setDiscountType] = useState('AMOUNT') // AMOUNT, PERCENTAGE
    const [discountValue, setDiscountValue] = useState(0)
    const [showDiscountInput, setShowDiscountInput] = useState(false)

    // Derived Totals using shared utilities
    const subtotal = calculateCartTotal(tableCart.items)
    const discountAmount = calculateDiscount(subtotal, discountType, discountValue)
    const total = calculateTotal(subtotal, discountAmount)

    // Sync amounts based on method
    useEffect(() => {
        if (paymentMethod === 'CASH') {
            setCashAmount(total)
            setTransferAmount(0)
        } else if (paymentMethod === 'TRANSFER') {
            setTransferAmount(total)
            setCashAmount(0)
        } else if (paymentMethod === 'COMBINED') {
            // Maintain balance if possible, or reset to cash
            setCashAmount(total)
            setTransferAmount(0)
        }
    }, [paymentMethod, total])

    const handleFinalize = async () => {
        setLoading(true)
        const orderItems = tableCart.items.map(item => ({
            ProductId: item.product.id,
            Name: item.product.title,
            UnitPrice: item.product.price,
            Quantity: item.qty,
            SelectedToppingNames: (item.toppings || []).map(t => t.title),
            Note: item.note
        }))

        const payload = {
            ClientOrderId: tableCart.clientOrderId || crypto.randomUUID(),
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

        try {
            setModal({
                show: true,
                title: 'Thành công',
                message: 'Đã nhận đơn hàng! Đang đồng bộ...',
                onConfirm: () => {
                    dispatch({ type: 'CLEAR_TABLE', payload: { tableId } })
                    nav('/')
                }
            })
            await api.createOrder(payload)
        } catch (e) {
            console.error('Checkout API call failed', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page checkout-page">
            <header className="page-header">
                <button className="back" onClick={() => nav(-1)} aria-label="Quay lại">
                    <IconChevron size={20} />
                </button>
                <div className="checkout-header-title">
                    <div className="title">Thanh toán</div>
                    <div className="subtitle">Bàn {tableId}: {tableCart.orderId || 'Mới'}</div>
                </div>
            </header>

            <div className="checkout-content">
                <div className="customer-info-box">
                    <div className="customer-icon">👤</div>
                    <div className="customer-name">Khách lẻ</div>
                    <button className="customer-edit-btn" aria-label="Thay đổi khách hàng">✎</button>
                </div>

                <div className="order-summary-box">
                    <div className="summary-row">
                        <div className="label">Tổng tiền hàng <span className="items-badge">{(tableCart.items || []).reduce((s, it) => s + (it.qty ?? it.quantity ?? 1), 0)} món</span></div>
                        <div className="value">{formatPrice(subtotal)}</div>
                    </div>

                    <button
                        className={`summary-row dashed-bottom clickable-row ${showDiscountInput ? 'active' : ''}`}
                        onClick={() => setShowDiscountInput(!showDiscountInput)}
                    >
                        <div className="label">Giảm giá {discountValue > 0 ? `(${discountType === 'PERCENTAGE' ? discountValue + '%' : '✎'})` : '✎'}</div>
                        <div className={`value ${discountValue > 0 ? 'success' : ''}`}>-{formatPrice(discountAmount)}</div>
                    </button>

                    {showDiscountInput && (
                        <div className="discount-input-area">
                            <div className="type-tabs">
                                <button
                                    className={discountType === 'AMOUNT' ? 'active' : ''}
                                    onClick={(e) => { e.stopPropagation(); setDiscountType('AMOUNT'); }}
                                >
                                    Số tiền (đ)
                                </button>
                                <button
                                    className={discountType === 'PERCENTAGE' ? 'active' : ''}
                                    onClick={(e) => { e.stopPropagation(); setDiscountType('PERCENTAGE'); }}
                                >
                                    Phần trăm (%)
                                </button>
                            </div>

                            <div className="quick-discounts">
                                {discountType === 'PERCENTAGE' ? (
                                    <>
                                        {[5, 10, 15, 20].map(p => (
                                            <button key={p} onClick={(e) => { e.stopPropagation(); setDiscountValue(p); }}>{p}%</button>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {[10000, 20000, 50000, 100000].map(a => (
                                            <button key={a} onClick={(e) => { e.stopPropagation(); setDiscountValue(a); }}>{a / 1000}k</button>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="input-with-suffix" onClick={e => e.stopPropagation()}>
                                <input
                                    type="number"
                                    value={discountValue}
                                    onChange={e => setDiscountValue(Number(e.target.value))}
                                    autoFocus
                                    placeholder="0"
                                />
                                <span>{discountType === 'PERCENTAGE' ? '%' : 'đ'}</span>
                            </div>
                        </div>
                    )}

                    <div className="summary-row total-row">
                        <div className="total-label">Khách cần trả</div>
                        <div className="total-value">{formatPrice(total)}</div>
                    </div>
                </div>

                <h4 className="payment-section-title">Phương thức thanh toán</h4>

                <div className="payment-methods">
                    {[
                        { id: 'CASH', label: 'Tiền mặt', icon: '💵' },
                        { id: 'TRANSFER', label: 'Chuyển khoản', icon: '🏦' },
                        { id: 'COMBINED', label: 'Kết hợp', icon: '➕' }
                    ].map(method => (
                        <div key={method.id}>
                            <button
                                onClick={() => setPaymentMethod(method.id)}
                                className={`payment-method-item ${paymentMethod === method.id ? 'active' : ''}`}
                            >
                                <span>{method.icon}</span>
                                <div className="label">{method.label}</div>

                                {paymentMethod === method.id && method.id !== 'COMBINED' && (
                                    <div className="payment-numeric-info">
                                        {formatPrice(total, true)}
                                    </div>
                                )}
                            </button>

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
                                            Lệch: {formatPrice(Math.abs(total - (cashAmount + transferAmount)), true)}
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
                    disabled={loading || (paymentMethod === 'COMBINED' && cashAmount + transferAmount !== total)}
                >
                    {loading ? 'Đang xử lý...' : `Thanh toán: ${formatPrice(total)}`}
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
