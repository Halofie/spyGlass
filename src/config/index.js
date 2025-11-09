const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    useMock: import.meta.env.VITE_USE_MOCK_API === 'true',
  },
  aws: {
    region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
    cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      clientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
    },
  },
  features: {
    webhookTriggers: import.meta.env.VITE_ENABLE_WEBHOOK_TRIGGERS === 'true',
    scheduledTriggers: import.meta.env.VITE_ENABLE_SCHEDULED_TRIGGERS === 'true',
    emailActions: import.meta.env.VITE_ENABLE_EMAIL_ACTIONS === 'true',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'SpyGlass',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
};

export default config;
