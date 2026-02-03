import { apiFetch } from './client';

export const ShopService = {
    getMyShop: () => apiFetch('/Shops/my'),
    updateMyShop: (data) => apiFetch('/Shops/my', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // Super Admin methods (can be used if needed)
    getAllShops: () => apiFetch('/Shops'),
    getShopById: (id) => apiFetch(`/Shops/${id}`),
    updateShop: (id, data) => apiFetch(`/Shops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};
