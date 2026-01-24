import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '@/shared/contexts/ProductContext'
import { useCartDispatch, useTableCartDispatch } from '@/shared/contexts/CartContext'
import SearchBar from '@/shared/components/ui/SearchBar'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useToast } from '@/shared/contexts/UIContext'
import useDebounce from '@/shared/hooks/useDebounce'
import './ProductList.scss'
import IconChevron from '@/shared/components/ui/IconChevron'

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams()
    const initial = searchParams.get('q') || ''
    const [q, setQ] = useState(initial)
    const debouncedQ = useDebounce(q, 300)
    const [selectedCat, setSelectedCat] = useState('all')

    const navigate = useNavigate()
    const tableId = searchParams.get('table')
    const empty = !!searchParams.get('empty')

    // Use table-specific dispatch if tableId is present
    const globalDispatch = useCartDispatch()
    const tableDispatch = useTableCartDispatch(tableId)
    const dispatch = tableId ? tableDispatch : globalDispatch

    useEffect(() => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            if (debouncedQ) newParams.set('q', debouncedQ)
            else newParams.delete('q')
            return newParams
        }, { replace: true })
    }, [debouncedQ, setSearchParams])

    // focus param: if present, focus and remove it from URL
    useEffect(() => {
        const f = searchParams.get('focus')
        if (f) {
            // remove focus param but keep q
            const copy = Object.fromEntries([...searchParams.entries()].filter(([k]) => k !== 'focus'))
            setSearchParams(copy, { replace: true })
        }
    }, [searchParams])

    const { products, categories: sortedCategories, loading } = useProducts()

    // Extract unique categories (prefer sorted list from API)
    const categories = useMemo(() => {
        if (sortedCategories && sortedCategories.length > 0) {
            return ['all', ...sortedCategories]
        }
        const cats = new Set(products.map(p => p.category).filter(Boolean))
        return ['all', ...Array.from(cats)]
    }, [products, sortedCategories])

    const filtered = useMemo(() => {
        const term = (debouncedQ || '').trim().toLowerCase()
        let res = products

        // Filter by category
        if (selectedCat !== 'all') {
            res = res.filter(p => p.category === selectedCat)
        }

        // Filter by search
        if (term) {
            res = res.filter(p => p.title.toLowerCase().includes(term))
        }

        return res
    }, [debouncedQ, products, selectedCat])

    const term = (debouncedQ || '').trim()

    if (loading && products.length === 0) return <LoadingSpinner fullScreen message="Đang tải thực đơn..." />

    const showToast = useToast()

    const handleAdd = (p) => {
        if (tableId) {
            dispatch({ type: 'ADD_TO_TABLE', payload: { product: p } })
        } else {
            dispatch({ type: 'ADD', payload: { product: p } })
        }
        showToast(`${p.title} đã được thêm`)
    }

    const focus = !!searchParams.get('focus')
    const title = tableId ? `Bàn ${tableId}` : 'Sản phẩm'

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
                <button className="back product-list-back" onClick={handleBack} aria-label="Quay lại">
                    <IconChevron size={22} />
                </button>
                <h2 className="product-list-title">{title}</h2>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${selectedCat === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCat('all')}
                >
                    Tất cả
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
                        {term ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
                        <br /><small>Thử từ khóa hoặc danh mục khác</small>
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
