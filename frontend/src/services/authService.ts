import api from './api';

const AUTH_URL = '/v1/auth';

export const authService = {
  // Login
  login: async (credentials: any) => {
    const response = await api.post(`${AUTH_URL}/login`, credentials);
    return response.data.data;
  },

  // Logout
  logout: async (data?: { refreshToken: string }) => {
    const response = await api.post(`${AUTH_URL}/logout`, data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post(`${AUTH_URL}/refresh`, { refreshToken });
    return response.data.data;
  },

  // Get current user (me) - if needed, although login returns user
  getCurrentUser: async () => {
    // This could call a /me endpoint if added to backend, 
    // for now we use what's returned in login or health
    const response = await api.get(`${AUTH_URL}/health`);
    return response.data.data;
  },

  // Validate session
  validateSession: async (sessionId: string) => {
    const response = await api.get(`${AUTH_URL}/session/${sessionId}/validate`);
    return response.data.data;
  },

  // Logout from all devices
  logoutAllDevices: async (userId: number) => {
    const response = await api.post(`${AUTH_URL}/logout-all?userId=${userId}`);
    return response.data;
  }
};
