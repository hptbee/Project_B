import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { cacheService, CACHE_KEYS } from '../services/cache/cacheService'

const ProductContext = createContext()

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadMenu = useCallback(async (forceRefresh = false) => {
        try {
            setLoading(true)

            // Check cache first (unless force refresh)
            if (!forceRefresh) {
                const cachedMenu = cacheService.get(CACHE_KEYS.MENU)
                if (cachedMenu) {
                    console.log('Loading menu from cache')
                    processMenuData(cachedMenu)
                    setLoading(false)
                    return
                }
            }

            // Fetch from API
            console.log('Fetching menu from API')
            const data = await api.getMenu()

            // Save to cache
            cacheService.set(CACHE_KEYS.MENU, data)

            processMenuData(data)
            setLoading(false)
        } catch (err) {
            console.error(err)
            setError(err)
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
        loadMenu()
    }, [loadMenu])

    return (
        <ProductContext.Provider value={{ products, categories, loading, error, syncProducts }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts() {
    return useContext(ProductContext)
}
