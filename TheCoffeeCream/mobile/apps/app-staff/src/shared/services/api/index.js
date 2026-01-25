// API exports - Backward compatibility layer
// This file maintains the old api.js interface while using ui-shared modular structure

import { productsApi, ordersApi, reportsApi } from '@thecoffeecream/ui-shared'

/**
 * Legacy API object for backward compatibility
 * @deprecated Use individual API modules from @thecoffeecream/ui-shared instead
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

// Export individual modules from ui-shared for easier migration
export { productsApi, ordersApi, reportsApi }
