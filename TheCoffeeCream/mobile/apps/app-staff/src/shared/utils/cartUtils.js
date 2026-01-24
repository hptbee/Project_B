/**
 * Cart Utilities
 * Helper functions for cart operations to ensure consistency
 */

/**
 * Generates a unique key for a cart item based on its properties
 * @param {Object} product - The product object (must have id)
 * @param {Array} toppings - Array of toppings
 * @param {string} note - Note for the item
 * @returns {string} Unique string key combining product ID, toppings, and note
 */
export const generateCartItemKey = (product, toppings = [], note = '') => {
    // Sort toppings by ID to ensure 'A+B' is the same key as 'B+A'
    const sortedToppings = [...toppings].sort((a, b) => a.id.localeCompare(b.id));

    // Create topping string: "id1x1,id2x1"
    const toppingString = sortedToppings
        .map(t => `${t.id}x${t.qty || 1}`)
        .join(',');

    return `${product.id}:${toppingString}:${note || ''}`;
};

/**
 * Generates a simple Order ID (e.g., 11-1234)
 * @returns {string} Order ID
 */
export const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-4);
    return `11-${timestamp}`;
};
