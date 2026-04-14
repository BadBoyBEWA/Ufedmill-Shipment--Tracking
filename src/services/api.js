/**
 * Fetch-based API client for Ufed Express.
 * Handles: base URL, auth tokens, token refresh on 401, JSON parsing.
 */

const API_BASE_URL = 'https://ufedmill-shipment-tracking.onrender.com/api';

async function refreshAccessToken(skipAuthRedirect = false) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      if (!skipAuthRedirect) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
      return null;
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch {
    if (!skipAuthRedirect) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return null;
  }
}

/**
 * Core request function.
 * @param {string} path - API path (e.g., '/shipments')
 * @param {RequestInit} options - fetch options
 * @param {boolean} retry - whether to retry after token refresh (internal flag)
 * @param {boolean} skipAuthRedirect - if true, don't redirect to login on failure
 */
async function request(path, options = {}, retry = true, skipAuthRedirect = false) {
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
    credentials: 'include',
  });

  if (response.status === 401 && retry) {
    const data = await response.json().catch(() => ({}));
    const newToken = await refreshAccessToken(skipAuthRedirect);
    if (newToken) {
      return request(path, options, false, skipAuthRedirect);
    }
    return response;
  }

  return response;
}

// ============================================================
// Convenience methods
// ============================================================
const api = {
  get: (path, skipAuthRedirect = false) => request(path, { method: 'GET' }, true, skipAuthRedirect),

  post: (path, body, skipAuthRedirect = false) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }, true, skipAuthRedirect),

  put: (path, body, skipAuthRedirect = false) =>
    request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, true, skipAuthRedirect),

  delete: (path, skipAuthRedirect = false) => request(path, { method: 'DELETE' }, true, skipAuthRedirect),

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
