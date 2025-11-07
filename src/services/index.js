import api from './api';
import { mockApi, shouldUseMockApi } from './mockApi';

// Applet service - switches between mock and real API
export const appletService = {
  getAll: async () => {
    if (shouldUseMockApi()) {
      return mockApi.getApplets();
    }
    return api.get('/applets');
  },

  getById: async (id) => {
    if (shouldUseMockApi()) {
      return mockApi.getApplet(id);
    }
    return api.get(`/applets/${id}`);
  },

  create: async (applet) => {
    if (shouldUseMockApi()) {
      return mockApi.createApplet(applet);
    }
    return api.post('/applets', applet);
  },

  update: async (id, updates) => {
    if (shouldUseMockApi()) {
      return mockApi.updateApplet(id, updates);
    }
    return api.put(`/applets/${id}`, updates);
  },

  delete: async (id) => {
    if (shouldUseMockApi()) {
      return mockApi.deleteApplet(id);
    }
    return api.delete(`/applets/${id}`);
  },

  toggle: async (id) => {
    if (shouldUseMockApi()) {
      return mockApi.toggleApplet(id);
    }
    return api.patch(`/applets/${id}/toggle`);
  },

  getExecutions: async (id) => {
    if (shouldUseMockApi()) {
      return mockApi.getExecutions(id);
    }
    return api.get(`/applets/${id}/executions`);
  },
};

// Auth service
export const authService = {
  login: async (email, password) => {
    if (shouldUseMockApi()) {
      return mockApi.login(email, password);
    }
    return api.post('/auth/login', { email, password });
  },

  signup: async (email, password, name) => {
    if (shouldUseMockApi()) {
      return mockApi.signup(email, password, name);
    }
    return api.post('/auth/signup', { email, password, name });
  },

  logout: async () => {
    if (shouldUseMockApi()) {
      return mockApi.logout();
    }
    return api.post('/auth/logout');
  },

  refreshToken: async () => {
    if (shouldUseMockApi()) {
      return { data: { token: 'mock-refreshed-token' } };
    }
    return api.post('/auth/refresh');
  },
};

// Webhook service
export const webhookService = {
  trigger: async (webhookId, payload) => {
    if (shouldUseMockApi()) {
      return { data: { success: true, message: 'Webhook triggered (mock)' } };
    }
    return api.post(`/webhooks/${webhookId}`, payload);
  },
};
