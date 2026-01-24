import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useCartDispatch } from '@/shared/contexts/CartContext'
import { calculateCartTotal } from '@/shared/utils/calculations'
import { formatPrice } from '@/shared/utils/formatters'
import Icon from '@/shared/components/ui/Icon'
import IconChevron from '@/shared/components/ui/IconChevron'
import './Cart.scss'

export default function Cart() {
    const { items } = useCart()
    const navigate = useNavigate()
    const dispatch = useCartDispatch()

    const total = calculateCartTotal(items)

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Thanh toán</h2>
            </header>

            <div className="checkout">
                <div className="summary-card">
                    <div className="label">Tổng tiền hàng ({items.length})</div>
                    <div className="amount">{formatPrice(total, true)}</div>
                </div>

                <h4 className="cart-section-title">PHƯƠNG THỨC THANH TOÁN</h4>
                <div className="payment-preview">💵 Tiền mặt</div>

                <div className="cart-items-container">
                    {items.map(it => (
                        <div key={it.key} className="cart-item">
                            <div className="item-info">
                                <div className="item-name">{it.product.title}</div>
                                <div className="item-price">{formatPrice(it.product.price * it.qty, true)}</div>
                            </div>
                            <div className="item-actions">
                                <div className="cart-qty-bar">
                                    <button className="qty-btn" onClick={() => dispatch({ type: 'SET_QTY', payload: { key: it.key, qty: Math.max(1, it.qty - 1) } })}>
                                        <Icon name="minus" size={14} color="var(--text-secondary)" />
                                    </button>
                                    <div className="qty-val">{it.qty}</div>
                                    <button className="qty-btn plus" onClick={() => dispatch({ type: 'SET_QTY', payload: { key: it.key, qty: it.qty + 1 } })}>
                                        <Icon name="plus" size={14} color="#fff" />
                                    </button>
                                </div>
                                <button className="remove-btn" onClick={() => dispatch({ type: 'REMOVE', payload: { key: it.key } })}>
                                    <Icon name="trash" size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="pay-btn" onClick={() => navigate('/checkout/takeaway')}>
                    Thanh toán • {formatPrice(total, true)}
                </button>
            </div>
        </div>
    )
}
