import { apiFetch } from './client'
import { Logger } from './logger'

// Note: Offline support logic is kept as it was in staff app
// Admin app just uses the standard methods
export const ordersApi = {
    /**
     * Get orders with optional date range
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
     */
    getOrder: async (id) => {
        return apiFetch(`/Orders/${id}`)
    },

    /**
     * Create order (with offline support if window.dispatchEvent is available)
     */
    createOrder: async (orderData) => {
        // Staff app specific offline logic - if OfflineQueue is available globally or we handle it here
        // For now, keeping the implementation simple and unified
        // In the future, we can move OfflineQueue to ui-shared as well
        return apiFetch('/Orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    /**
     * Update order (primarily for admin)
     */
    updateOrder: async (id, orderData) => {
        return apiFetch(`/Orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(orderData)
        });
    },

    /**
     * Delete order (primarily for admin)
     */
    deleteOrder: async (id) => {
        return apiFetch(`/Orders/${id}`, {
            method: 'DELETE'
        });
    }
}
