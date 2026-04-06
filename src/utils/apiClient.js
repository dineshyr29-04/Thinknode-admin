import { API_ENDPOINT } from '../config/api';

// Token management
const getToken = () => {
  try {
    const session = localStorage.getItem('tn_activeSession');
    return session ? JSON.parse(session).token : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const setToken = (token) => {
  try {
    const session = JSON.parse(localStorage.getItem('tn_activeSession'));
    session.token = token;
    localStorage.setItem('tn_activeSession', JSON.stringify(session));
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

const clearToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem('tn_activeSession'));
    delete session.token;
    localStorage.setItem('tn_activeSession', JSON.stringify(session));
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// API Client
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    skipAuth = false,
  } = options;

  const url = `${API_ENDPOINT}${endpoint}`;
  const token = getToken();

  // Request logging
  const safeBody = body ? { ...body } : null;
  if (safeBody && safeBody.password) safeBody.password = '********';
  
  console.log(`[API Request] ${method} ${url}`, {
    headers: { ...headers, ...(token && !skipAuth ? { Authorization: 'Bearer [HIDDEN]' } : {}) },
    body: safeBody
  });

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token && !skipAuth) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
    });

    console.log(`[API Response] ${response.status} ${url}`);

    // Handle unauthorized
    if (response.status === 401) {
      // Don't redirect if it's the login endpoint
      if (endpoint === '/admin/login') {
        console.warn('Login failed: Unauthorized credentials provided.');
      } else {
        clearToken();
        console.log(`Unauthorized ACCESS Denied: ${response.status} ${response.url}`)
        window.location.href = '/login';
        throw new Error('Unauthorized. Please login again.');
      }
    }

    const data = await response.json();
    console.log(`[API Data]`, data);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        data,
      };
    }

    // Update token if provided in response
    if (data.token) {
      setToken(data.token);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Helper methods
export const apiGet = (endpoint, options = {}) => 
  apiCall(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body, options = {}) => 
  apiCall(endpoint, { ...options, method: 'POST', body });

export const apiPut = (endpoint, body, options = {}) => 
  apiCall(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = (endpoint, body, options = {}) => 
  apiCall(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = (endpoint, options = {}) => 
  apiCall(endpoint, { ...options, method: 'DELETE' });

// File upload helper
export const apiUploadFile = async (endpoint, file, options = {}) => {
  const { headers = {} } = options;
  const token = getToken();
  const url = `${API_ENDPOINT}${endpoint}`;

  const formData = new FormData();
  formData.append('file', file);

  const requestHeaders = { ...headers };
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
    });

    if (response.status === 401) {
      clearToken();
      window.location.href = '/login';
      throw new Error('Unauthorized. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Upload failed',
        data,
      };
    }

    return data;
  } catch (error) {
    console.error(`Upload Error [${endpoint}]:`, error);
    throw error;
  }
};
