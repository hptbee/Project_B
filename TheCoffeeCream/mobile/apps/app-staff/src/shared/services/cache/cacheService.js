// Cache Service for Mobile App
// Uses localStorage for persistent caching

const CACHE_KEYS = {
    MENU: 'app_cache_menu',
    PRODUCTS: 'app_cache_products',
    ORDERS: 'app_cache_orders_today',
    REPORT: 'app_cache_report_today',
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

class CacheService {
    /**
     * Get cached data
     * @param {string} key - Cache key
     * @returns {any|null} - Cached data or null if expired/not found
     */
    get(key) {
        try {
            const cached = localStorage.getItem(key)
            if (!cached) return null

            const { data, timestamp, ttl } = JSON.parse(cached)

            // Check if expired
            if (this.isExpired(timestamp, ttl)) {
                this.clear(key)
                return null
            }

            return data
        } catch (error) {
            console.error('Cache get error:', error)
            return null
        }
    }

    /**
     * Set cache data
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds (default: 24h)
     */
    set(key, data, ttl = DEFAULT_TTL) {
        try {
            const cacheEntry = {
                data,
                timestamp: Date.now(),
                ttl
            }
            localStorage.setItem(key, JSON.stringify(cacheEntry))
        } catch (error) {
            console.error('Cache set error:', error)
            // If localStorage is full, clear old caches
            if (error.name === 'QuotaExceededError') {
                this.clearAll()
                // Try again
                try {
                    localStorage.setItem(key, JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        ttl
                    }))
                } catch (retryError) {
                    console.error('Cache set retry error:', retryError)
                }
            }
        }
    }

    /**
     * Check if cache is expired
     * @param {number} timestamp - Cache timestamp
     * @param {number} ttl - Time to live
     * @returns {boolean}
     */
    isExpired(timestamp, ttl) {
        return Date.now() - timestamp > ttl
    }

    /**
     * Clear specific cache
     * @param {string} key - Cache key
     */
    clear(key) {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Cache clear error:', error)
        }
    }

    /**
     * Clear all app caches
     */
    clearAll() {
        try {
            Object.values(CACHE_KEYS).forEach(key => {
                localStorage.removeItem(key)
            })
        } catch (error) {
            console.error('Cache clearAll error:', error)
        }
    }

    /**
     * Get cache info for debugging
     * @param {string} key - Cache key
     * @returns {object|null}
     */
    getInfo(key) {
        try {
            const cached = localStorage.getItem(key)
            if (!cached) return null

            const { timestamp, ttl } = JSON.parse(cached)
            const age = Date.now() - timestamp
            const remaining = ttl - age

            return {
                key,
                timestamp: new Date(timestamp).toISOString(),
                age: Math.floor(age / 1000 / 60), // minutes
                remaining: Math.floor(remaining / 1000 / 60), // minutes
                expired: this.isExpired(timestamp, ttl)
            }
        } catch (error) {
            console.error('Cache getInfo error:', error)
            return null
        }
    }
}

export const cacheService = new CacheService()
export { CACHE_KEYS }
