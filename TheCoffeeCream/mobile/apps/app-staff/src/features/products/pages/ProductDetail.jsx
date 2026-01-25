import { useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useCartDispatch, useTableCart } from '@/shared/contexts/CartContext'
import { useProducts } from '@/shared/contexts/ProductContext'
import { Icon, useToast, IconChevron, useTranslation } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import './ProductDetail.scss'

export default function ProductDetail() {
    const { t } = useTranslation()
    const { id } = useParams()
    const nav = useNavigate()
    const { products } = useProducts()
    const product = products.find(p => p.id === id)

    const [searchParams] = useSearchParams()
    const location = useLocation()
    const { showToast } = useToast()
    const dispatch = useCartDispatch()

    const tableId = searchParams.get('table') || new URLSearchParams(location.search).get('table')
    const itemKey = searchParams.get('itemKey')
    const tableCart = useTableCart(tableId)

    // Find existing item if editing
    const existingItem = useMemo(() => {
        if (!itemKey || !tableCart) return null
        return tableCart.items.find(i => i.key === itemKey)
    }, [itemKey, tableCart])

    // Initial State Hydration
    const [qty, setQty] = useState(() => existingItem ? existingItem.qty : 1)
    const [note, setNote] = useState(() => existingItem ? existingItem.note : '')
    const [toppingsState, setToppingsState] = useState(() => {
        const baseToppings = (product?.toppings || []).map(t => ({ ...t, qty: 0 }))
        if (existingItem && existingItem.toppings) {
            return baseToppings.map(bt => {
                const et = existingItem.toppings.find(t => t.id === bt.id)
                return et ? { ...bt, qty: et.qty } : bt
            })
        }
        return baseToppings
    })

    // Calculate dynamic total
    const total = useMemo(() => {
        if (!product) return 0
        const toppingsTotal = toppingsState.reduce((s, t) => s + (t.price * t.qty), 0)
        return (product.price + toppingsTotal) * qty
    }, [product, toppingsState, qty])

    if (!product) return (
        <div className="page product-not-found">
            <header className="page-header">
                <button className="back icon-btn" onClick={() => nav(-1)}><IconChevron size={20} /></button>
                <h2>{t('common.error')}</h2>
            </header>
            <div className="page-content">{t('common.no_products_found')}...</div>
        </div>
    )

    const handleAction = () => {
        const selectedToppings = toppingsState.filter(t => t.qty > 0).map(t => ({
            id: t.id,
            title: t.title,
            price: t.price,
            qty: t.qty
        }))

        const payload = {
            product: { id: product.id, title: product.title, price: product.price },
            qty,
            toppings: selectedToppings,
            note
        }

        if (existingItem) {
            // EDIT MODE
            dispatch({
                type: 'UPDATE_ITEM_TABLE',
                payload: { ...payload, tableId, oldKey: itemKey }
            })
            showToast(t('common.update_success_msg', { name: product.title }))
            nav(`/table/${tableId}`)
        } else {
            // ADD MODE
            if (tableId) {
                dispatch({ type: 'ADD_TO_TABLE', payload: { ...payload, tableId } })
                showToast(t('common.add_to_table_success', { name: product.title, table: tableId }))
                nav(`/table/${tableId}`)
            } else {
                dispatch({ type: 'ADD', payload })
                showToast(t('common.add_to_cart_success', { name: product.title }))
                nav(-1)
            }
        }
    }

    return (
        <div className="page detail">
            <header className="page-header">
                <button className="back icon-btn" onClick={() => nav(-1)} aria-label={t('cart.back')}>
                    <IconChevron size={20} />
                </button>
                <h2>{existingItem ? t('pos.update_item') : product.title}</h2>
            </header>

            <div className="product-card">
                <div className="thumb product-detail-thumb" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                <div className="info">
                    <h3>{product.title}</h3>
                    <div className="price">{formatPrice(product.price, true)}</div>
                </div>
            </div>

            {toppingsState.length > 0 && (
                <>
                    <h4 className="detail-section-title">{t('common.topping')}</h4>
                    <div className="toppings">
                        {toppingsState.map(t => (
                            <div className="topping" key={t.id}>
                                <div className="topping-info">
                                    <div className="topping-title">{t.title}</div>
                                    <div className="topping-price">+{formatPrice(t.price)}</div>
                                </div>
                                {t.qty > 0 ? (
                                    <div className="topping-qty-bar">
                                        <button className="icon-btn" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: Math.max(0, tt.qty - 1) } : tt))}>
                                            <Icon name="minus" size={14} color="var(--text-primary)" />
                                        </button>
                                        <div className="qty-val">{t.qty}</div>
                                        <button className="icon-btn plus" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: tt.qty + 1 } : tt))}>
                                            <Icon name="plus" size={14} color="var(--text-on-accent)" />
                                        </button>
                                    </div>
                                ) : (
                                    <button className="add-topping-btn icon-btn" onClick={() => setToppingsState(prev => prev.map(tt => tt.id === t.id ? { ...tt, qty: 1 } : tt))}>
                                        <Icon name="plus" size={18} color="var(--accent-amber)" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            <h4 className="detail-section-title">{t('common.note').toUpperCase()}</h4>
            <div className="notes">
                <textarea
                    placeholder={t('pos.placeholder_note')}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </div>

            <div className="qty-adjustment">
                <button className="adj-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Icon name="minus" size={24} color="var(--text-primary)" />
                </button>
                <div className="adj-val">{qty}</div>
                <button className="adj-btn active" onClick={() => setQty(qty + 1)}>
                    <Icon name="plus" size={24} color="var(--text-on-accent)" />
                </button>
            </div>

            <button className="bottom-action btn-primary" onClick={handleAction}>
                {existingItem ? t('pos.update_item') : t('pos.add_to_order')} • {formatPrice(total, true)}
            </button>
        </div>
    )
}
