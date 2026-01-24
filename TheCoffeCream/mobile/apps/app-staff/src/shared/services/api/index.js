// API exports - Backward compatibility layer
// This file maintains the old api.js interface while using new modular structure

import { productsApi } from './products'
import { ordersApi } from './orders'
import { reportsApi } from './reports'

/**
 * Legacy API object for backward compatibility
 * @deprecated Use individual API modules instead
 */
export const api = {
    // Products
    getProducts: productsApi.getProducts,
    getMenu: productsApi.getMenu,

    // Orders
    createOrder: ordersApi.createOrder,
    getOrders: ordersApi.getOrders,
    getOrder: ordersApi.getOrder,

    // Reports
    getDailyReport: reportsApi.getDailyReport
}

// Export individual modules for new code
export { productsApi, ordersApi, reportsApi }
