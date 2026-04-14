import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for admin authentication state.
 * Reads from localStorage and validates with the server on mount.
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('adminUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate token with server on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/admin/me')
      .then((res) => api.parseResponse(res))
      .then((data) => {
        setAdmin(data);
        setIsAuthenticated(true);
        localStorage.setItem('adminUser', JSON.stringify(data));
      })
      .catch(() => {
        setIsAuthenticated(false);
        setAdmin(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminUser');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    const response = await api.post('/admin/login', { email, password, rememberMe });
    const data = await api.parseResponse(response);

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('adminUser', JSON.stringify(data.admin));
    setAdmin(data.admin);
    setIsAuthenticated(true);

    // Small delay to ensure token is ready for subsequent requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/admin/logout', {});
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminUser');
      setIsAuthenticated(false);
      setAdmin(null);
      window.location.href = '/admin/login';
    }
  }, []);

  return { isAuthenticated, admin, loading, login, logout };
}
