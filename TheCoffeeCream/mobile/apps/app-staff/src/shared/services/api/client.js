// API Client - Base configuration and utilities

import { API_CONFIG } from '@/shared/constants/config';

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
    try {
        const response = await fetchWithTimeout(`${API_BASE}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            // If 503 (Service Unavailable) or 504 (Gateway Timeout), it might be waking up
            if ((response.status === 503 || response.status === 504) && retries > 0) {
                console.log(`Server sleeping? Retrying... (${retries} attempts left)`);
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s
                return apiFetch(url, options, retries - 1);
            }

            const error = await response.text();
            throw new Error(error || `API Error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        if (retries > 0 && (error.name === 'AbortError' || error.message.includes('Failed to fetch'))) {
            // Retry on timeout or network error (server possibly down/sleeping)
            console.log(`Fetch failed/timeout. Retrying... (${retries} attempts left)`);
            await new Promise(r => setTimeout(r, 3000)); // Wait 3s
            return apiFetch(url, options, retries - 1);
        }
        throw error;
    }
}

export { apiFetch, API_BASE }
