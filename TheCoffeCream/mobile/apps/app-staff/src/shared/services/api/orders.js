import { apiFetch } from './client'

/**
 * Orders API
 */
export const ordersApi = {
    /**
     * Create new order
     * @param {Object} orderData - Order data
     */
    createOrder: async (orderData) => {
        return apiFetch('/Orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        })
    },

    /**
     * Get orders with optional date range
     * @param {string} startDate - Start date (optional)
     * @param {string} endDate - End date (optional)
     */
    getOrders: async (startDate, endDate) => {
        let url = '/Orders'
        if (startDate || endDate) {
            const params = new URLSearchParams()
            if (startDate) params.set('startDate', startDate)
            if (endDate) params.set('endDate', endDate)
            url += `?${params.toString()}`
        }
        return apiFetch(url)
    },

    /**
     * Get single order by ID
     * @param {string} id - Order ID
     */
    getOrder: async (id) => {
        return apiFetch(`/Orders/${id}`)
    }
}
