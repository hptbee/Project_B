import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart, useCartDispatch } from '@/shared/contexts/CartContext'
import { calculateCartTotal } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import { Icon, IconChevron, useTranslation } from '@thecoffeecream/ui-shared'
import './Cart.scss'

export default function Cart() {
    const { t } = useTranslation()
    const { items } = useCart()
    const navigate = useNavigate()
    const dispatch = useCartDispatch()
    const prevItemsLength = useRef(items.length)

    const total = calculateCartTotal(items)

    // On mount, if empty -> go to Products.
    // If becomes empty later (delete), stay here.
    const initialItemsCount = useRef(items.length)
    useEffect(() => {
        if (initialItemsCount.current === 0) {
            navigate('/products', { replace: true })
        }
    }, [navigate])

    return (
        <div className="page">
            <header className="page-header">
                <button className="back icon-btn" onClick={() => navigate(-1)} aria-label={t('action.cancel')}>
                    <IconChevron variant="bold" />
                </button>
                <h2>{t('action.checkout')}</h2>
            </header>

            <div className="checkout">
                <div className="summary-card">
                    <div className="label">{t('pos.qty')} ({(items || []).reduce((s, it) => s + (it.qty ?? it.quantity ?? 1), 0)})</div>
                    <div className="amount">{formatPrice(total, true)}</div>
                </div>

                <h4 className="cart-section-title">{t('common.payment_method')}</h4>
                <div className="payment-preview">💵 {t('common.cash')}</div>

                <div className="cart-items-container">
                    {items.length === 0 ? (
                        <div className="empty-cart-state">
                            <Icon name="shopping-cart" size={48} />
                            <p>{t('common.no_data')}</p>
                            <button className="btn-secondary" onClick={() => navigate('/products')}>
                                {t('action.add_item')}
                            </button>
                        </div>
                    ) : (
                        items.map(it => (
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
                                    <button className="remove-btn icon-btn danger" onClick={() => dispatch({ type: 'REMOVE', payload: { key: it.key } })}>
                                        <Icon name="trash" size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    className="pay-btn btn-primary"
                    onClick={() => navigate('/checkout/takeaway')}
                    disabled={items.length === 0}
                >
                    {t('action.checkout')} • {formatPrice(total, true)}
                </button>
            </div>
        </div>
    )
}
