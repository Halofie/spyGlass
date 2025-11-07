import config from '../config';

// Mock data store
let mockApplets = [
  {
    id: '1',
    name: 'Daily Weather Email',
    trigger: { type: 'schedule', value: 'Every day at 8:00 AM' },
    action: { type: 'email', value: 'Send weather update' },
    enabled: true,
    lastRun: '2 hours ago',
    config: {
      trigger: { schedule: 'Every day at 8:00 AM' },
      action: { to: 'user@example.com', subject: 'Weather Update', body: 'Daily weather report' }
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Webhook to Email',
    trigger: { type: 'webhook', value: 'When webhook received' },
    action: { type: 'email', value: 'Forward to email' },
    enabled: true,
    lastRun: 'Never',
    config: {
      trigger: {},
      action: { to: 'user@example.com', subject: 'Webhook Alert', body: 'Webhook triggered' }
    },
    createdAt: new Date().toISOString(),
  },
];

// Mock API functions
export const mockApi = {
  // Applets
  getApplets: async () => {
    await delay(500);
    return { data: mockApplets };
  },

  getApplet: async (id) => {
    await delay(300);
    const applet = mockApplets.find(a => a.id === id);
    if (!applet) throw new Error('Applet not found');
    return { data: applet };
  },

  createApplet: async (applet) => {
    await delay(500);
    const newApplet = {
      ...applet,
      id: Date.now().toString(),
      enabled: true,
      lastRun: 'Never',
      createdAt: new Date().toISOString(),
    };
    mockApplets.push(newApplet);
    return { data: newApplet };
  },

  updateApplet: async (id, updates) => {
    await delay(500);
    const index = mockApplets.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Applet not found');
    mockApplets[index] = { ...mockApplets[index], ...updates };
    return { data: mockApplets[index] };
  },

  deleteApplet: async (id) => {
    await delay(500);
    mockApplets = mockApplets.filter(a => a.id !== id);
    return { data: { success: true } };
  },

  toggleApplet: async (id) => {
    await delay(300);
    const applet = mockApplets.find(a => a.id === id);
    if (!applet) throw new Error('Applet not found');
    applet.enabled = !applet.enabled;
    return { data: applet };
  },

  // Auth (will be replaced with Cognito)
  login: async (email, password) => {
    await delay(800);
    // Mock validation
    if (!email || !password) {
      throw new Error('Invalid credentials');
    }
    return {
      data: {
        user: {
          id: '1',
          email: email,
          name: email.split('@')[0],
        },
        token: 'mock-jwt-token-' + Date.now(),
      }
    };
  },

  signup: async (email, password, name) => {
    await delay(1000);
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }
    return {
      data: {
        user: {
          id: '1',
          email: email,
          name: name,
        },
        token: 'mock-jwt-token-' + Date.now(),
      }
    };
  },

  logout: async () => {
    await delay(200);
    return { data: { success: true } };
  },

  // Execution history
  getExecutions: async (appletId) => {
    await delay(500);
    return {
      data: [
        {
          id: '1',
          appletId: appletId,
          status: 'success',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          duration: 245,
        },
        {
          id: '2',
          appletId: appletId,
          status: 'success',
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          duration: 312,
        },
      ]
    };
  },
};

// Helper function to simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if we should use mock API
export const shouldUseMockApi = () => config.api.useMock;
