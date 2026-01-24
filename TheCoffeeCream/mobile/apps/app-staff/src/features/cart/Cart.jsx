import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useCartDispatch } from '@/shared/contexts/CartContext'
import './Cart.scss'
import IconChevron from '@/shared/components/ui/IconChevron'

export default function Cart() {
    const { items } = useCart()
    const navigate = useNavigate()
    const dispatch = useCartDispatch()

    const total = items.reduce((s, i) => s + i.product.price * i.qty + (i.toppings || []).reduce((t, tt) => t + tt.price, 0) * i.qty, 0)

    return (
        <div className="page">
            <header className="page-header">
                <button className="back" onClick={() => navigate(-1)} aria-label="Quay lại">
                    <IconChevron variant="bold" />
                </button>
                <h2>Thanh toán</h2>
            </header>

            <div className="checkout">
                <div className="summary">
                    <div>Tổng tiền hàng <span>{items.length}</span></div>
                    <div className="amount">{total.toLocaleString()}</div>
                </div>

                <h4>PHƯƠNG THỨC THANH TOÁN</h4>
                <div className="payment">Tiền mặt</div>

                <div className="cart-items-container">
                    {items.map(it => (
                        <div key={it.key} className="cart-item">
                            <div className="item-main">
                                <div>{it.product.title}</div>
                                <div>{(it.product.price * it.qty).toLocaleString()}</div>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => dispatch({ type: 'SET_QTY', payload: { key: it.key, qty: Math.max(1, it.qty - 1) } })}>-</button>
                                <div className="qty-display">{it.qty}</div>
                                <button onClick={() => dispatch({ type: 'SET_QTY', payload: { key: it.key, qty: it.qty + 1 } })}>+</button>
                                <button onClick={() => dispatch({ type: 'REMOVE', payload: { key: it.key } })}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pay-btn">Thanh toán: {total.toLocaleString()}</div>
            </div>
        </div>
    )
}
