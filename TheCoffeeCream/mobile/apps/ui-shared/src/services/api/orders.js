import { apiFetch } from './client'

// Note: Offline support logic is kept as it was in staff app
// Admin app just uses the standard methods
export const ordersApi = {
    /**
     * Get orders with optional date range and payment method
     */
    getOrders: async (startDate, endDate, paymentMethod) => {
        let url = '/Orders'
        const params = new URLSearchParams()
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)
        if (paymentMethod) params.set('paymentMethod', paymentMethod)

        if ([...params].length > 0) {
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
     * Update payment method
     */
    updatePaymentMethod: async (id, data) => {
        return apiFetch(`/Orders/${id}/payment-method`, {
            method: 'PATCH',
            body: JSON.stringify(data)
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
