/**
 * Cache Service for Mobile App
 * Uses localStorage for persistent caching
 */

export const CACHE_KEYS = {
    MENU: 'app_cache_menu',
    PRODUCTS: 'app_cache_products',
    ORDERS: 'app_cache_orders_today',
    REPORT: 'app_cache_report_today',
};

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

class CacheService {
    get(key) {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const { data, timestamp, ttl } = JSON.parse(cached);

            if (this.isExpired(timestamp, ttl)) {
                this.clear(key);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    set(key, data, ttl = DEFAULT_TTL) {
        try {
            const cacheEntry = {
                data,
                timestamp: Date.now(),
                ttl
            };
            localStorage.setItem(key, JSON.stringify(cacheEntry));
        } catch (error) {
            console.error('Cache set error:', error);
            if (error.name === 'QuotaExceededError') {
                this.clearAll();
                try {
                    localStorage.setItem(key, JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        ttl
                    }));
                } catch (retryError) {
                    console.error('Cache set retry error:', retryError);
                }
            }
        }
    }

    isExpired(timestamp, ttl) {
        return Date.now() - timestamp > ttl;
    }

    clear(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    clearAll() {
        try {
            Object.values(CACHE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Cache clearAll error:', error);
        }
    }
}

export const cacheService = new CacheService();
