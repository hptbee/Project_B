import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, useTranslation } from '@thecoffeecream/ui-shared'
import { formatPrice } from '@thecoffeecream/ui-shared'
import '@/styles/components.scss'

function highlightText(text, term) {
    if (!term) return text
    const idx = text.toLowerCase().indexOf(term.toLowerCase())
    if (idx === -1) return text
    return (<>{text.slice(0, idx)}<mark>{text.slice(idx, idx + term.length)}</mark>{text.slice(idx + term.length)}</>)
}

export default function ProductCard({ product, onAdd, highlight = '' }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <div className="product-row product-row-clickable" onClick={() => navigate(`/products/${product.id}${window.location.search}`)}>
            <div className="thumb-small" />
            <div className="meta">
                <div className="title">{highlightText(product.title, highlight)}</div>
                <div className="price">{formatPrice(product.price, true)}</div>
            </div>
            <div className="product-card-actions">
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}${window.location.search}`) }}
                    className="add-btn"
                    aria-label={t('action.add_item')}
                >
                    <Icon name="plus" size={18} color="var(--accent-amber)" />
                </button>
            </div>
        </div>
    )
}
