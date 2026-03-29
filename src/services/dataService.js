import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiClient';
import { ENDPOINTS } from '../config/api';

// Clients Service
export const clientService = {
  getAll: async () => apiGet(ENDPOINTS.CLIENTS.LIST),
  getById: async (id) => apiGet(ENDPOINTS.CLIENTS.GET(id)),
  create: async (data) => apiPost(ENDPOINTS.CLIENTS.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.CLIENTS.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.CLIENTS.DELETE(id)),
};

// Projects Service
export const projectService = {
  getAll: async () => apiGet(ENDPOINTS.PROJECTS.LIST),
  getById: async (id) => apiGet(ENDPOINTS.PROJECTS.GET(id)),
  create: async (data) => apiPost(ENDPOINTS.PROJECTS.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.PROJECTS.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.PROJECTS.DELETE(id)),
};

// Services Service
export const servicesService = {
  getAll: async () => apiGet(ENDPOINTS.SERVICES.LIST),
  getById: async (id) => apiGet(ENDPOINTS.SERVICES.GET(id)),
  create: async (data) => apiPost(ENDPOINTS.SERVICES.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.SERVICES.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.SERVICES.DELETE(id)),
};

// Payments Service
export const paymentService = {
  getAll: async () => apiGet(ENDPOINTS.PAYMENTS.LIST),
  getById: async (id) => apiGet(ENDPOINTS.PAYMENTS.GET(id)),
  create: async (data) => apiPost(ENDPOINTS.PAYMENTS.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.PAYMENTS.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.PAYMENTS.DELETE(id)),
};

// Files Service
export const fileService = {
  getAll: async () => apiGet(ENDPOINTS.FILES.LIST),
  getById: async (id) => apiGet(ENDPOINTS.FILES.GET(id)),
  delete: async (id) => apiDelete(ENDPOINTS.FILES.DELETE(id)),
};

// Automations Service
export const automationService = {
  getAll: async () => apiGet(ENDPOINTS.AUTOMATIONS.LIST),
  getById: async (id) => apiGet(ENDPOINTS.AUTOMATIONS.GET(id)),
  create: async (data) => apiPost(ENDPOINTS.AUTOMATIONS.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.AUTOMATIONS.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.AUTOMATIONS.DELETE(id)),
};

// Invoices Service
export const invoiceService = {
  getAll: async () => apiGet(ENDPOINTS.INVOICES.LIST),
  create: async (data) => apiPost(ENDPOINTS.INVOICES.CREATE, data),
  update: async (id, data) => apiPut(ENDPOINTS.INVOICES.UPDATE(id), data),
  delete: async (id) => apiDelete(ENDPOINTS.INVOICES.DELETE(id)),
  download: async (id) => apiGet(ENDPOINTS.INVOICES.DOWNLOAD(id)),
};
