import { apiFetch } from './client'

/**
 * Reports API
 */
export const reportsApi = {
    /**
     * Get daily report
     * @param {string} date - Date in YYYY-MM-DD format
     */
    getDailyReport: async (date) => {
        return apiFetch(`/Reports/daily?date=${date}`)
    }
}
