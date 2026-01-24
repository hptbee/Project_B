// ID and key generation utilities

/**
 * Generate order ID
 * @returns {string} Order ID (e.g., "11-5678")
 */
export const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-4)
    return `11-${timestamp}`
}

/**
 * Generate unique key for cart item
 * @param {Object} product - Product object
 * @param {Array} toppings - Array of toppings
 * @param {string} note - Item note
 * @returns {string} Unique key for the item
 */
export const generateItemKey = (product, toppings = [], note = '') => {
    const toppingStr = toppings.map(t => `${t.id}x${t.qty || 1}`).join(',')
    return `${product.id}:${toppingStr}:${note}`
}
