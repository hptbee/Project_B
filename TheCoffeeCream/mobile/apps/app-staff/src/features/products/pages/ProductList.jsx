import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBar, LoadingSpinner, useToast, Icon, IconChevron, useTranslation } from '@thecoffeecream/ui-shared'
import { useProductFilter } from '../hooks/useProductFilter'
import ProductCard from '../components/ProductCard'
import './ProductList.scss'
import { useProducts } from '@/shared/contexts/ProductContext'
import { useCartDispatch } from '@/shared/contexts/CartContext'

export default function ProductList() {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const tableId = searchParams.get('table')
    const { products, categories: sortedCategories, loading } = useProducts()

    // Key Logic Extracted to Hook
    const {
        q, setQ,
        selectedCat, setSelectedCat,
        categories,
        filteredProducts: filtered,
        isSearching,
        term
    } = useProductFilter(products, sortedCategories)

    const dispatch = useCartDispatch()

    if (loading && products.length === 0) return <LoadingSpinner fullScreen message={t('nav.menu') + '...'} />

    const { showToast } = useToast()

    const handleAdd = (p) => {
        if (tableId) {
            dispatch({ type: 'ADD_TO_TABLE', payload: { product: p } })
        } else {
            dispatch({ type: 'ADD', payload: { product: p } })
        }
        showToast(t('common.added_item', { name: p.title }))
    }

    const focus = !!searchParams.get('focus')
    const title = tableId ? `${t('status.occupied')} ${tableId}` : t('nav.menu')

    // Check if we are searching or in a specific context to show elements
    const showHeaderConfig = {
        backIcon: '✕',
        showActions: true
    }

    const handleBack = () => {
        try {
            const historyState = window.history && window.history.state
            const hasIndex = historyState && typeof historyState.idx === 'number'
            const canGoBack = hasIndex ? historyState.idx > 0 : window.history.length > 1
            if (canGoBack) {
                navigate(-1)
            } else {
                navigate('/')
            }
        } catch (e) {
            navigate('/')
        }
    }

    return (
        <div className="page products-page">
            <header className="page-header">
                <button className="back product-list-back" onClick={handleBack} aria-label={t('cart.back')}>
                    <IconChevron size={22} />
                </button>
                <h2 className="product-list-title">{title}</h2>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${selectedCat === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCat('all')}
                >
                    {t('common.all')}
                </button>
                {categories.filter(c => c !== 'all').map(c => (
                    <button
                        key={c}
                        className={`tab ${selectedCat === c ? 'active' : ''}`}
                        onClick={() => setSelectedCat(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <SearchBar value={q} onChange={setQ} autoFocus={focus} />

            <div className="list">
                {filtered.length === 0 ? (
                    <div className="empty-list-container">
                        {term ? t('common.no_products_found') : t('common.no_products_category')}
                        <br /><small>{t('common.try_another_search')}</small>
                    </div>
                ) : (
                    filtered.map(p => (
                        <ProductCard key={p.id} product={p} highlight={term} onAdd={() => handleAdd(p)} />
                    ))
                )}
            </div>

        </div>
    )
}
