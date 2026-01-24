import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useDebounce from '@/shared/hooks/useDebounce'

/**
 * Hook to manage product filtering, search, and categories
 * @param {Array} products - List of all products
 * @param {Array} sortedCategories - List of sorted category names
 */
export function useProductFilter(products, sortedCategories) {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQ = searchParams.get('q') || ''

    // State
    const [q, setQ] = useState(initialQ)
    const [selectedCat, setSelectedCat] = useState('all')
    const debouncedQ = useDebounce(q, 300)

    // Sync URL with Search
    useEffect(() => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            if (debouncedQ) newParams.set('q', debouncedQ)
            else newParams.delete('q')
            return newParams
        }, { replace: true })
    }, [debouncedQ, setSearchParams])

    // Cleanup 'focus' param from URL
    useEffect(() => {
        if (searchParams.get('focus')) {
            const copy = Object.fromEntries([...searchParams.entries()].filter(([k]) => k !== 'focus'))
            setSearchParams(copy, { replace: true })
        }
    }, [searchParams, setSearchParams])

    // Derive Categories
    const categories = useMemo(() => {
        if (sortedCategories && sortedCategories.length > 0) {
            return ['all', ...sortedCategories]
        }
        const cats = new Set(products.map(p => p.category).filter(Boolean))
        return ['all', ...Array.from(cats)]
    }, [products, sortedCategories])

    const term = (debouncedQ || '').trim().toLowerCase()

    // Filter Products
    const filteredProducts = useMemo(() => {
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
    }, [debouncedQ, products, selectedCat, term])

    return {
        q,
        setQ,
        selectedCat,
        setSelectedCat,
        categories,
        filteredProducts,
        isSearching: !!debouncedQ,
        term
    }
}
