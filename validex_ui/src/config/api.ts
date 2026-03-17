/**
 * Pach API Gateway - Configuration
 * Centralized API entry point to avoid proxy issues and redirect loops.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${API_URL}/api/v1`;

export const getApiUrl = (endpoint: string) => {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Ensure no double slashes if using direct URL
    return `${API_BASE_URL}${cleanEndpoint}`;
};
