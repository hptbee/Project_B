// Shared calculation utilities

/**
 * Calculate total for a single cart item
 * @param {Object} item - Cart item with product, qty, and toppings
 * @returns {number} Total price for the item
 */
export const calculateItemTotal = (item) => {
    const basePrice = item.product.price * item.qty
    const toppingsPrice = (item.toppings || []).reduce((sum, t) => sum + t.price, 0) * item.qty
    return basePrice + toppingsPrice
}

/**
 * Calculate total for all cart items
 * @param {Array} items - Array of cart items
 * @returns {number} Total price for all items
 */
export const calculateCartTotal = (items) => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
}

/**
 * Calculate discount amount
 * @param {number} subtotal - Subtotal before discount
 * @param {string} type - Discount type ('AMOUNT' or 'PERCENTAGE')
 * @param {number} value - Discount value
 * @returns {number} Discount amount
 */
export const calculateDiscount = (subtotal, type, value) => {
    if (type === 'PERCENTAGE') {
        return Math.floor((subtotal * value) / 100)
    }
    return value
}

/**
 * Calculate final total after discount
 * @param {number} subtotal - Subtotal before discount
 * @param {number} discount - Discount amount
 * @returns {number} Final total
 */
export const calculateTotal = (subtotal, discount) => {
    return Math.max(0, subtotal - discount)
}
