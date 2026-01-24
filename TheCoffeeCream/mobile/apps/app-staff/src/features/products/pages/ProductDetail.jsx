import React, { useState } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useCartDispatch } from '@/shared/contexts/CartContext'
import { useToast } from '@/shared/contexts/UIContext'

import { useProducts } from '@/shared/contexts/ProductContext'
import './ProductDetail.scss'
import IconChevron from '@/shared/components/ui/IconChevron'

export default function ProductDetail() {
    const { id } = useParams()
    const nav = useNavigate()
    const { products } = useProducts()
    const product = products.find(p => p.id === id)

    // Toppings logic - API returns toppings in product object based on my mapper
    const initialToppings = (product?.toppings || []).map(t => ({ ...t, qty: 0 }))

    const [searchParams] = useSearchParams()
    const location = useLocation()
    const tableId = searchParams.get('table') || new URLSearchParams(location.search).get('table')
    const dispatch = useCartDispatch()
    const showToast = useToast()
    const [qty, setQty] = useState(1)
    const [toppingsState, setToppingsState] = useState(initialToppings)
    const [note, setNote] = useState('')

    if (!product) return <div className="page product-not-found">Loading or Product Not Found...</div>

    return (
        <div className="page detail">
            <header className="page-header">
                <button className="back" onClick={() => nav(-1)} aria-label="Quay lại">
                    <IconChevron size={20} />
                </button>
                <h2>{product.title}</h2>
            </header>

            <div className="product-card">
                <div className="thumb product-detail-thumb" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                <div className="info">
                    <h3>{product.title}</h3>
                    <div className="price">{product.price.toLocaleString()}</div>
                </div>
            </div>

            {toppingsState.length > 0 && (
                <>
                    <h4>TOPPING</h4>
                    <div className="toppings">
                        {toppingsState.map(t => (
                            <div className="topping" key={t.id}>
                                <div>
                                    <div className="topping-title">{t.title}</div>
                                    <div className="topping-price">{t.price.toLocaleString()}</div>
                                </div>
                                {t.qty > 0 ? (
                                    <div className="topping-qty">
                                        <button className="minus" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: Math.max(0, tt.qty - 1) } : tt))}>－</button>
                                        <div className="qty">{t.qty}</div>
                                        <button className="plus" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: tt.qty + 1 } : tt))}>＋</button>
                                    </div>
                                ) : (
                                    <button className="plus-only plus" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: 1 } : tt))}>＋</button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            <div className="notes">
                <textarea placeholder="Nhập ghi chú" value={note} onChange={e => setNote(e.target.value)} />
            </div>

            <div className="qty-row">
                <button className="minus" onClick={() => setQty(Math.max(1, qty - 1))}>－</button>
                <div className="qty">{qty}</div>
                <button className="plus" onClick={() => setQty(qty + 1)}>＋</button>
            </div>

            <div className="bottom-action" onClick={() => {
                const finalQty = qty
                const selectedToppings = (toppingsState || []).filter(t => t.qty > 0).map(t => ({ id: t.id, title: t.title, price: t.price, qty: t.qty }))
                const tableIdLocal = tableId || new URLSearchParams(window.location.search).get('table')
                if (tableIdLocal) {
                    dispatch({ type: 'ADD_TO_TABLE', payload: { tableId: tableIdLocal, product: { id: product.id, title: product.title, price: product.price }, qty: finalQty, toppings: selectedToppings, note } })
                    showToast(`${product.title} đã được thêm`)
                    nav(`/table/${tableIdLocal}`)
                } else {
                    dispatch({ type: 'ADD', payload: { product: { id: product.id, title: product.title, price: product.price }, qty: finalQty, toppings: selectedToppings, note } })
                    showToast(`${product.title} đã được thêm`)
                }
            }}>
                {(() => {
                    const toppingsPerProduct = (toppingsState || []).reduce((s, t) => s + (Number(t.price) || 0) * (Number(t.qty) || 0), 0)
                    const total = ((Number(product.price) || 0) + toppingsPerProduct) * (Number(qty) || 1)
                    return `Thêm vào đơn • ${total.toLocaleString()} đ`
                })()}
            </div>
        </div>
    )
}
