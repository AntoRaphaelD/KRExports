import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * KAYAAR EXPORTS - CENTRALIZED API SERVICE
 * Maps exactly to the Sequelize Controllers and Express Routes
 */
export const mastersAPI = {
  
  // --- 1. ACCOUNTS MASTER (Images 7 & 8) ---
  accounts: {
    getAll: (params) => api.get('/accounts', { params }),
    getOne: (id) => api.get(`/accounts/${id}`),
    create: (data) => api.post('/accounts', data),
    update: (id, data) => api.put(`/accounts/${id}`, data),
    delete: (id) => api.delete(`/accounts/${id}`)
  },

  // --- 2. PRODUCT MASTER (Image 1) ---
  products: {
    getAll: (params) => api.get('/products', { params }),
    getOne: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
  },

  // --- 3. TARIFF SUB HEAD MASTER (Image 2) ---
  tariffs: {
    getAll: (params) => api.get('/tariffs', { params }),
    getOne: (id) => api.get(`/tariffs/${id}`),
    create: (data) => api.post('/tariffs', data),
    update: (id, data) => api.put(`/tariffs/${id}`, data),
    delete: (id) => api.delete(`/tariffs/${id}`)
  },

  // --- 4. TRANSPORT MASTER (Image 3) ---
  transports: {
    getAll: (params) => api.get('/transports', { params }),
    getOne: (id) => api.get(`/transports/${id}`),
    create: (data) => api.post('/transports', data),
    update: (id, data) => api.put(`/transports/${id}`, data),
    delete: (id) => api.delete(`/transports/${id}`)
  },

  // --- 5. BROKER MASTER (Image 4) ---
  brokers: {
    getAll: (params) => api.get('/brokers', { params }),
    getOne: (id) => api.get(`/brokers/${id}`),
    create: (data) => api.post('/brokers', data),
    update: (id, data) => api.put(`/brokers/${id}`, data),
    delete: (id) => api.delete(`/brokers/${id}`)
  },

  // --- 6. PACKING TYPE MASTER (Image 5) ---
  packingTypes: {
    getAll: (params) => api.get('/packing-types', { params }),
    getOne: (id) => api.get(`/packing-types/${id}`),
    create: (data) => api.post('/packing-types', data),
    update: (id, data) => api.put(`/packing-types/${id}`, data),
    delete: (id) => api.delete(`/packing-types/${id}`)
  },

  // --- 7. INVOICE TYPE MASTER (Image 12) ---
  invoiceTypes: {
    getAll: (params) => api.get('/invoice-types', { params }),
    getOne: (id) => api.get(`/invoice-types/${id}`),
    create: (data) => api.post('/invoice-types', data),
    update: (id, data) => api.put(`/invoice-types/${id}`, data),
    delete: (id) => api.delete(`/invoice-types/${id}`)
  },

  // --- 8. SPINNING COUNT MASTER (Required for Product dropdown) ---
  spinningCounts: {
    getAll: (params) => api.get('/spinning-counts', { params }),
    getOne: (id) => api.get(`/spinning-counts/${id}`),
    create: (data) => api.post('/spinning-counts', data),
    update: (id, data) => api.put(`/spinning-counts/${id}`, data),
    delete: (id) => api.delete(`/spinning-counts/${id}`)
  }
};

export const transactionsAPI = {
  // --- 9. SALES ORDER / CONFIRMATION (Images 9, 10, 11) ---
  // Transactional endpoint handling Header + Array of Details
  orders: {
    getAll: (params) => api.get('/orders', { params }),
    getOne: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data), // Data contains { ...header, Details: [] }
    update: (id, data) => api.put(`/orders/${id}`, data),
    delete: (id) => api.delete(`/orders/${id}`)
  },

  // --- 10. RG1 PRODUCTION (Image 12 - Bottom) ---
  production: {
    getAll: (params) => api.get('/production', { params }),
    getOne: (id) => api.get(`/production/${id}`),
    create: (data) => api.post('/production', data),
    update: (id, data) => api.put(`/production/${id}`, data),
    delete: (id) => api.delete(`/production/${id}`)
  },

  // --- 11. DESPATCH ENTRY (Images 13 & 14) ---
  despatch: {
    getAll: (params) => api.get('/despatch', { params }),
    getOne: (id) => api.get(`/despatch/${id}`),
    create: (data) => api.post('/despatch', data),
    update: (id, data) => api.put(`/despatch/${id}`, data),
    delete: (id) => api.delete(`/despatch/${id}`)
  }
};

export default api;