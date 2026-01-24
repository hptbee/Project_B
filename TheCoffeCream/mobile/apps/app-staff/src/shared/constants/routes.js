// Application route constants

export const ROUTES = {
    HOME: '/',
    TABLE: '/table/:tableId',
    CHECKOUT: '/checkout/:tableId',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    SYNC: '/sync',
    KITCHEN: '/kitchen',
    REQUESTS: '/requests',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:id',
    RECEIPTS: '/receipts',
    REPORT: '/report',
    SETTINGS: '/settings',
    HELP: '/help',
    TERMS: '/terms',
    SUPPORT: '/support',
    LANGUAGE: '/lang',
    LOGOUT: '/logout'
}

/**
 * Generate dynamic route path
 * @param {string} route - Route template
 * @param {Object} params - Route parameters
 * @returns {string} Generated route path
 */
export const generatePath = (route, params = {}) => {
    let path = route
    Object.entries(params).forEach(([key, value]) => {
        path = path.replace(`:${key}`, value)
    })
    return path
}
