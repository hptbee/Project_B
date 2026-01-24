import { apiFetch } from '@thecoffeecream/ui-shared'
import { OfflineQueue } from '../offline/offlineQueue'
import { Logger } from '@thecoffeecream/ui-shared'

/**
 * Orders API
 */
export const ordersApi = {
    createOrder: async (orderData) => {
        // ALWAYS use offline queue first for instant feedback (Zero-latency)
        await OfflineQueue.addOrder(orderData);

        // Trigger background sync immediately in next tick
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-sync'));
        }, 100);

        return {
            id: orderData.id || orderData.ClientOrderId || 'offline-pending',
            status: 'PENDING_SYNC',
            message: 'Đã lưu. Đang đồng bộ ngầm...'
        };
    },

    /**
     * Legacy method preserved for compatibility
     */
    createOrderOffline: async (orderData) => {
        return ordersApi.createOrder(orderData);
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
