/**
 * Global App Configuration
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    TIMEOUT_MS: 90000,
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 2000,
};

export const APP_INFO = {
    NAME: 'Coffee Cream Staff',
    VERSION: '1.0.0',
};
