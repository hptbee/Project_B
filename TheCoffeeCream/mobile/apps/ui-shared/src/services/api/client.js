// API Client - Base configuration and utilities

import { API_CONFIG } from '../../constants/config';
import { Logger } from './logger';

const API_BASE = API_CONFIG.BASE_URL;

/**
 * Base fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */

async function fetchWithTimeout(resource, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}

async function apiFetch(url, options = {}, retries = API_CONFIG.MAX_RETRIES) {
    const fullUrl = `${API_BASE}${url}`;
    const method = options.method || 'GET';

    Logger.info(`[API REQUEST] ${method} ${fullUrl}`);
    if (options.body) {
        Logger.info(`[API BODY] ${options.body}`);
    }

    const isJsonRequest = method !== 'GET' && method !== 'HEAD';

    try {
        const token = localStorage.getItem('auth_token');
        const authUser = localStorage.getItem('auth_user');
        let shopId = null;
        if (authUser) {
            try {
                shopId = JSON.parse(authUser).shopId;
            } catch (e) {
                Logger.error('Failed to parse auth_user for shopId');
            }
        }

        const fetchOptions = {
            ...options,
            headers: {
                ...(isJsonRequest ? { 'Content-Type': 'application/json' } : {}),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...(shopId ? { 'x-shop-id': shopId } : {}),
                ...options.headers
            }
        };

        const response = await fetchWithTimeout(fullUrl, fetchOptions);

        Logger.info(`[API RESPONSE] ${method} ${fullUrl} - Status: ${response.status}`);

        if (!response.ok) {
            // If 503 (Service Unavailable) or 504 (Gateway Timeout), it might be waking up
            if ((response.status === 503 || response.status === 504) && retries > 0) {
                Logger.warn(`[API RETRY] Server sleeping? Retrying... (${retries} attempts left)`);
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s
                return apiFetch(url, options, retries - 1);
            }

            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: await response.text() };
            }

            if (response.status === 401) {
                if (errorData?.code === 'SessionConflict') {
                    Logger.warn(`[AUTH] Session Conflict - Dispatching session conflict event`);
                    window.dispatchEvent(new CustomEvent('auth:session_conflict', { detail: errorData }));
                } else {
                    Logger.warn(`[AUTH] 401 Unauthorized - Dispatching logout event`);
                    window.dispatchEvent(new Event('auth:unauthorized'));
                }
            }

            const errorMessage = errorData?.message || errorData || `API Error: ${response.status}`;
            Logger.error(`[API ERROR RESPONSE] ${method} ${fullUrl} - ${JSON.stringify(errorMessage)}`);

            // Create error object with response data attached
            const error = new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            error.response = { data: errorData, status: response.status };
            throw error;
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        Logger.error(`[API FETCH ERROR] ${method} ${fullUrl} - ${error.message}`);

        if (retries > 0 && (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
            // Retry on timeout or network error (server possibly down/sleeping)
            Logger.warn(`[API RETRY] Fetch failed/timeout. Retrying... (${retries} attempts left)`);
            await new Promise(r => setTimeout(r, 3000)); // Wait 3s
            return apiFetch(url, options, retries - 1);
        }
        throw error;
    }
}

export { apiFetch, API_BASE }
