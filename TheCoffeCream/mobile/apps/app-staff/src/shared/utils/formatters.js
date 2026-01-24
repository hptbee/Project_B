// Shared utility functions for formatting

/**
 * Format timestamp to Vietnamese time format
 * @param {number} start - Start timestamp
 * @returns {string} Formatted time (e.g., "2g 30p" or "45p")
 */
export const formatTime = (start) => {
    if (!start) return '0p'
    const diff = Date.now() - start
    if (diff < 0) return '0p'
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}p`
    return `${hours}g ${mins}p`
}

/**
 * Format price to Vietnamese currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price (e.g., "100,000")
 */
export const formatPrice = (amount) => {
    return amount.toLocaleString('vi-VN')
}

/**
 * Format date to Vietnamese format
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date (e.g., "24/01/2026")
 */
export const formatDate = (date) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}
