/**
 * Pach API Gateway - Configuration
 * Centralized API entry point to avoid proxy issues and redirect loops.
 */
const isServer = typeof window === 'undefined';
const API_URL = isServer ? (process.env.INTERNAL_API_URL || 'http://backend:8000') : '';
export const API_BASE_URL = `${API_URL}/api/v1`;

export const getApiUrl = (endpoint: string) => {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Ensure no double slashes if using direct URL
    return `${API_BASE_URL}${cleanEndpoint}`;
};
