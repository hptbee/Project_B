import { apiFetch } from './client'

export const productsApi = {
    getProducts: async () => {
        return apiFetch('/Products')
    },

    getProductById: async (id) => {
        return apiFetch(`/Products/${id}`)
    },

    getMenu: async () => {
        return apiFetch('/Menu')
    },

    getCategories: async () => {
        return apiFetch('/Products/categories')
    },

    createProduct: async (productData) => {
        return apiFetch('/Products', {
            method: 'POST',
            body: JSON.stringify(productData)
        })
    },

    updateProduct: async (id, productData) => {
        return apiFetch(`/Products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        })
    },

    toggleProductActive: async (id) => {
        return apiFetch(`/Products/${id}/toggle`, {
            method: 'PATCH'
        })
    }
}
