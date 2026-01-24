/**
 * Global App Configuration
 */
const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URL || '/api';
    if (!url.startsWith('http')) {
        console.warn(`[CONFIG] BASE_URL is relative (${url}). This will fail on mobile!`);
    }
    return url;
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT_MS: 90000,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000,
};

export const APP_INFO = {
    NAME: 'Coffee Cream Staff',
    VERSION: '1.0.0',
};
