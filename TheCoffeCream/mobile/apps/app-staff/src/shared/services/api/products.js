import { apiFetch } from './client'

/**
 * Products API
 */
export const productsApi = {
    /**
     * Get all products
     */
    getProducts: async () => {
        return apiFetch('/Products')
    },

    /**
     * Get menu with categories and products
     */
    getMenu: async () => {
        return apiFetch('/Menu')
    }
}
