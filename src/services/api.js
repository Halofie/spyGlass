import axios from 'axios';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import config from '../config';

const userPool = new CognitoUserPool({
  UserPoolId: config.aws.cognito.userPoolId,
  ClientId: config.aws.cognito.clientId,
});

// Create axios instance
const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      return new Promise((resolve) => {
        currentUser.getSession((err, session) => {
          if (!err && session.isValid()) {
            config.headers.Authorization = `Bearer ${session.getIdToken().getJwtToken()}`;
          }
          resolve(config);
        });
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - sign out and redirect to login
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        currentUser.signOut();
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
