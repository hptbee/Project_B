import { apiFetch } from '@thecoffeecream/ui-shared'

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
