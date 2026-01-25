import { productsApi } from '@thecoffeecream/ui-shared'

export const productApi = {
    getProducts: productsApi.getProducts,
    getProductById: productsApi.getProductById,
    getCategories: productsApi.getCategories,
    createProduct: productsApi.createProduct,
    updateProduct: productsApi.updateProduct,
    toggleProductActive: productsApi.toggleProductActive
}
