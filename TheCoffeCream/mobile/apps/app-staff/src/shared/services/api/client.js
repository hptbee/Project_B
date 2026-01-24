// API Client - Base configuration and utilities

const API_BASE = '/api'

/**
 * Base fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiFetch(url, options = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(error || `API Error: ${response.status}`)
    }

    return response.json()
}

export { apiFetch, API_BASE }
