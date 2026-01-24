import { apiFetch } from '@thecoffeecream/ui-shared'

/**
 * Dashboard API
 */
export const dashboardApi = {
    /**
     * Get overall dashboard statistics
     */
    getDashboardStats: async () => {
        // For now, aggregate from existing endpoints
        const today = new Date().toISOString().split('T')[0]

        try {
            const report = await apiFetch(`/Reports/daily?date=${today}`)

            return {
                todayRevenue: report.totalRevenue || 0,
                todayOrders: report.totalOrders || 0,
                averageOrderValue: report.totalOrders > 0
                    ? Math.round(report.totalRevenue / report.totalOrders)
                    : 0,
                totalProducts: report.productsSold?.length || 0,
                topProduct: report.productsSold?.[0] || null
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error)
            return {
                todayRevenue: 0,
                todayOrders: 0,
                averageOrderValue: 0,
                totalProducts: 0,
                topProduct: null
            }
        }
    },

    /**
     * Get recent orders
     */
    getRecentOrders: async (limit = 10) => {
        try {
            const orders = await apiFetch('/Orders')
            return orders.slice(0, limit)
        } catch (error) {
            console.error('Failed to fetch recent orders:', error)
            return []
        }
    },

    /**
     * Get revenue data for chart
     */
    getRevenueData: async (days = 7) => {
        const data = []
        const today = new Date()

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            try {
                const report = await apiFetch(`/Reports/daily?date=${dateStr}`)
                data.push({
                    date: dateStr,
                    revenue: report.totalRevenue || 0,
                    orders: report.totalOrders || 0
                })
            } catch (error) {
                data.push({
                    date: dateStr,
                    revenue: 0,
                    orders: 0
                })
            }
        }

        return data
    }
}
