/**
 * Nova Player Website - API Configuration
 * All API calls go through the central core endpoint
 */

export const API_BASE = import.meta.env.VITE_API_URL || 'https://core.nova-player.fr';

/**
 * Fetch wrapper with base URL and error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Device API endpoints (public)
 */
export const deviceApi = {
  register: (deviceCode: string, pin: string) =>
    apiRequest('/api/device/register', {
      method: 'POST',
      body: JSON.stringify({ device_code: deviceCode, pin }),
    }),
    
  getStatus: (deviceCode: string) =>
    apiRequest('/api/device/status', {
      method: 'POST',
      body: JSON.stringify({ device_code: deviceCode }),
    }),
    
  authenticate: (deviceCode: string, pin: string) =>
    apiRequest('/api/device/auth', {
      method: 'POST',
      body: JSON.stringify({ device_code: deviceCode, pin }),
    }),
};
