/**
 * Fetch-based API client for Ufedmill.
 * Handles: base URL, auth tokens, token refresh on 401, JSON parsing.
 */

const API_BASE_URL = 'https://ufedmill-shipment-tracking.onrender.com/api';

async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/refresh`, {
      method: 'POST',
      credentials: 'include', // Send the HTTP-only refresh token cookie
    });

    if (!res.ok) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
      return null;
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
    return null;
  }
}

/**
 * Core request function.
 * @param {string} path - API path (e.g., '/shipments')
 * @param {RequestInit} options - fetch options
 * @param {boolean} retry - whether to retry after token refresh (internal flag)
 */
async function request(path, options = {}, retry = true) {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Always include cookies for refresh token
  });

  // Attempt token refresh on 401
  if (response.status === 401 && retry) {
    const data = await response.json().catch(() => ({}));
    if (data.code === 'TOKEN_EXPIRED' || response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return request(path, options, false); // Retry once
      }
    }
    return response;
  }

  return response;
}

// ============================================================
// Convenience methods
// ============================================================
const api = {
  get: (path) => request(path, { method: 'GET' }),

  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (path) => request(path, { method: 'DELETE' }),

  /**
   * Parses a response, throwing an error with the API error message if not ok.
   */
  async parseResponse(response) {
    const data = await response.json().catch(() => ({ error: 'Invalid response from server.' }));
    if (!response.ok) {
      const message = data.error || `HTTP ${response.status}`;
      const err = new Error(message);
      err.details = data.details;
      err.status = response.status;
      throw err;
    }
    return data;
  },
};

export default api;
