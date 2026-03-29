import { apiPost, apiGet } from '../utils/apiClient';
import { ENDPOINTS } from '../config/api';

export const authService = {
  login: async (email, password) => {
    const response = await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password }, { skipAuth: true });
    if (response.token) {
      const session = JSON.parse(localStorage.getItem('tn_activeSession') || '{}');
      localStorage.setItem('tn_activeSession', JSON.stringify({
        ...response.user,
        token: response.token,
        email,
      }));
    }
    return response;
  },

  signup: async (userData) => {
    const response = await apiPost(ENDPOINTS.AUTH.SIGNUP, userData, { skipAuth: true });
    if (response.token) {
      localStorage.setItem('tn_activeSession', JSON.stringify({
        ...response.user,
        token: response.token,
      }));
    }
    return response;
  },

  logout: async () => {
    try {
      await apiPost(ENDPOINTS.AUTH.LOGOUT, {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('tn_activeSession');
  },

  refreshToken: async () => {
    const response = await apiPost(ENDPOINTS.AUTH.REFRESH, {});
    return response;
  },

  verifyToken: async () => {
    const response = await apiGet(ENDPOINTS.AUTH.VERIFY);
    return response;
  },

  getProfile: async () => {
    const response = await apiGet(ENDPOINTS.USERS.PROFILE);
    return response;
  },
};
