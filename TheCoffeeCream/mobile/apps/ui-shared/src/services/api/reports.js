import { apiFetch } from './client'

export const reportsApi = {
    getDailyReport: async (date) => {
        return apiFetch(`/Reports/daily?date=${date}`)
    },

    getRevenueReport: async (startDate, endDate, groupBy = 'day') => {
        return apiFetch(`/Reports/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`)
    },

    getProductReport: async (startDate, endDate, category = '') => {
        return apiFetch(`/Reports/products?startDate=${startDate}&endDate=${endDate}&category=${category}`)
    },

    getPaymentReport: async (startDate, endDate) => {
        return apiFetch(`/Reports/payment-methods?startDate=${startDate}&endDate=${endDate}`)
    },

    exportCsv: async (startDate, endDate) => {
        const response = await apiFetch(`/Reports/export?startDate=${startDate}&endDate=${endDate}`, {
            rawResponse: true
        })
        return response.blob()
    }
}
