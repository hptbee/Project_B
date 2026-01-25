import { apiFetch } from './client'

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
     * Create order (with optional offline support)
     */
    createOrder: async (orderData, { useOffline = false } = {}) => {
        if (useOffline) {
            const { OfflineQueue } = await import('../offline/OfflineQueue');
            await OfflineQueue.addOrder(orderData);

            // Trigger background sync
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('trigger-sync'));
            }, 100);

            return {
                id: orderData.id || orderData.ClientOrderId || 'offline-pending',
                status: 'PENDING_SYNC',
                message: 'Đã lưu. Đang đồng bộ ngầm...'
            };
        }

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
