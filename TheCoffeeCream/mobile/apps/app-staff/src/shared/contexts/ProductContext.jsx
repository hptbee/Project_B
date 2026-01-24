import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { cacheService, CACHE_KEYS } from '../services/cache/cacheService'
import { useAuth } from '@thecoffeecream/ui-shared'

const ProductContext = createContext()

export function ProductProvider({ children }) {
    const { isAuthenticated } = useAuth()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Use ref to access products in callbacks without adding dependencies
    const productsRef = React.useRef(products)
    useEffect(() => {
        productsRef.current = products
    }, [products])

    const loadMenu = useCallback(async (forceRefresh = false) => {
        try {
            // 1. Try to load from cache first for instant UI
            const cachedMenu = cacheService.get(CACHE_KEYS.MENU)
            if (cachedMenu && !forceRefresh) {
                console.log('Instant load from cache')
                processMenuData(cachedMenu)
                setLoading(false)
            } else {
                setLoading(true)
            }

            // 2. Fetch from API in background (SWR)
            console.log('Updating menu from API in background')
            const data = await api.getMenu()

            // 3. Save to cache and update UI
            cacheService.set(CACHE_KEYS.MENU, data)
            processMenuData(data)

            setLoading(false)
            setError(null)
        } catch (err) {
            console.error('Background sync failed:', err)
            // Only show error if we have no products at all
            if (productsRef.current.length === 0) {
                setError(err)
            }
            setLoading(false)
        }
    }, [])

    const processMenuData = (data) => {
        const catMap = {}
        let sortedCats = []

        if (data.categories) {
            sortedCats = data.categories.sort((a, b) => (a.rank || 0) - (b.rank || 0))
            sortedCats.forEach(c => {
                catMap[c.id] = c.name
            })
        }

        const rawProducts = data.products || []

        const adapted = rawProducts.map(p => {
            const catName = catMap[p.category] || p.category

            return {
                ...p,
                category: catName,
                title: p.name,
                toppings: (p.toppings || []).map(t => ({ ...t, title: t.name }))
            }
        })

        const sortedProducts = adapted.sort((a, b) => (a.code || '').localeCompare(b.code || ''))
        setProducts(sortedProducts)
        setCategories(sortedCats.map(c => c.name))
    }

    const syncProducts = useCallback(async () => {
        await loadMenu(true)
    }, [loadMenu])

    useEffect(() => {
        // Only load menu if user is authenticated
        if (isAuthenticated) {
            loadMenu()
        } else {
            // Clear products when not authenticated
            setProducts([])
            setCategories([])
            setLoading(false)
        }
    }, [loadMenu, isAuthenticated])

    return (
        <ProductContext.Provider value={{ products, categories, loading, error, syncProducts }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts() {
    return useContext(ProductContext)
}
