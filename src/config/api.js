// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/';
export const API_ENDPOINT = `${API_BASE_URL}${API_VERSION}`;

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
  
  // Clients
  CLIENTS: {
    LIST: '/clients',
    GET: (id) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE: (id) => `/clients/${id}`,
    DELETE: (id) => `/clients/${id}`,
  },
  
  // Projects
  PROJECTS: {
    LIST: '/projects',
    GET: (id) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id) => `/projects/${id}`,
    DELETE: (id) => `/projects/${id}`,
  },
  
  // Services
  SERVICES: {
    LIST: '/services',
    GET: (id) => `/services/${id}`,
    CREATE: '/services',
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    GET: (id) => `/payments/${id}`,
    CREATE: '/payments',
    UPDATE: (id) => `/payments/${id}`,
    DELETE: (id) => `/payments/${id}`,
  },
  
  // Files
  FILES: {
    LIST: '/files',
    GET: (id) => `/files/${id}`,
    UPLOAD: '/files/upload',
    DELETE: (id) => `/files/${id}`,
  },
  
  // Automations
  AUTOMATIONS: {
    LIST: '/automations',
    GET: (id) => `/automations/${id}`,
    CREATE: '/automations',
    UPDATE: (id) => `/automations/${id}`,
    DELETE: (id) => `/automations/${id}`,
  },

  // Invoices
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    UPDATE: (id) => `/invoices/${id}`,
    DELETE: (id) => `/invoices/${id}`,
    DOWNLOAD: (id) => `/invoices/${id}/download`,
  },
};
