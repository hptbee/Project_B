import { ordersApi } from '@thecoffeecream/ui-shared'

export const orderApi = {
    getOrders: ordersApi.getOrders,
    getOrderById: ordersApi.getOrder,
    updateOrder: ordersApi.updateOrder,
    deleteOrder: ordersApi.deleteOrder
}
