import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from './apiConfig';
import { getStoredToken } from './authToken';

// Define types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// Define user types based on API documentation
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  token: string;
  password?: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('==================== DEBUG START - AXIOS REQUEST INTERCEPTOR ====================');
    console.log('[AXIOS INTERCEPTOR] Request intercepted');
    console.log('[AXIOS INTERCEPTOR] Request URL:', config.url);
    console.log('[AXIOS INTERCEPTOR] Request Method:', config.method?.toUpperCase());
    console.log('[AXIOS INTERCEPTOR] Base URL:', config.baseURL);
    console.log('[AXIOS INTERCEPTOR] Full URL:', `${config.baseURL}${config.url}`);

    // Check for tokens
    const adminToken = localStorage.getItem('garja_admin_token');
    const userToken = getStoredToken();

    console.log('[AXIOS INTERCEPTOR] Token Check:');
    console.log('  - Admin Token:', adminToken ? `EXISTS (${adminToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - User Token (getStoredToken):', userToken ? `EXISTS (${userToken.substring(0, 20)}...)` : 'NOT FOUND');

    const token = adminToken || userToken;

    if (token) {
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
      console.log('[AXIOS INTERCEPTOR] Authorization header added:', `Bearer ${token.substring(0, 30)}...`);
    } else {
      console.warn('[AXIOS INTERCEPTOR] NO TOKEN FOUND - Request will be sent without Authorization header');
    }

    console.log('[AXIOS INTERCEPTOR] Final Request Headers:', config.headers);
    console.log('[AXIOS INTERCEPTOR] Request Data:', config.data);
    console.log('==================== DEBUG END - AXIOS REQUEST INTERCEPTOR ====================');

    return config;
  },
  (error) => {
    console.log('==================== DEBUG START - AXIOS REQUEST ERROR ====================');
    console.error('[AXIOS INTERCEPTOR] Request interceptor error:', error);
    console.log('==================== DEBUG END - AXIOS REQUEST ERROR ====================');
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('==================== DEBUG START - AXIOS RESPONSE INTERCEPTOR ====================');
    console.log('[AXIOS INTERCEPTOR] Response received');
    console.log('[AXIOS INTERCEPTOR] Response Status:', response.status);
    console.log('[AXIOS INTERCEPTOR] Response Status Text:', response.statusText);
    console.log('[AXIOS INTERCEPTOR] Response URL:', response.config.url);
    console.log('[AXIOS INTERCEPTOR] Response Headers:', response.headers);
    console.log('[AXIOS INTERCEPTOR] Response Data:', response.data);
    console.log('==================== DEBUG END - AXIOS RESPONSE INTERCEPTOR ====================');

    return response;
  },
  async (error: AxiosError) => {
    

    const originalRequest = error.config as any;
    console.log('[AXIOS INTERCEPTOR] Original Request URL:', originalRequest?.url);
    console.log('[AXIOS INTERCEPTOR] Original Request Method:', originalRequest?.method);

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error('[AXIOS INTERCEPTOR] 401 UNAUTHORIZED ERROR');
      console.error('[AXIOS INTERCEPTOR] Response Data:', error.response?.data);
      console.error('[AXIOS INTERCEPTOR] Response Headers:', error.response?.headers);

      originalRequest._retry = true;

      console.log('[AXIOS INTERCEPTOR] Clearing authentication data...');

      // Clear all auth data (both regular and admin). Support both new and legacy keys.
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      localStorage.removeItem('garja_token');
      localStorage.removeItem('garja_user');
      localStorage.removeItem('garja_admin_token');
      localStorage.removeItem('garja_admin');

      console.log('[AXIOS INTERCEPTOR] Auth data cleared from localStorage');

      // Notify app about logout so contexts can react
      if (typeof window !== 'undefined') {
        console.log('[AXIOS INTERCEPTOR] Dispatching auth:logout event');
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[AXIOS INTERCEPTOR] 403 FORBIDDEN ERROR');
      console.error('[AXIOS INTERCEPTOR] Response Data:', error.response?.data);

      // Check if this is an admin request and clear admin session
      const isAdminRequest = originalRequest?.url?.includes('/admin/');
      console.log('[AXIOS INTERCEPTOR] Is Admin Request:', isAdminRequest);

      if (isAdminRequest) {
        console.log('[AXIOS INTERCEPTOR] Clearing admin authentication...');
        localStorage.removeItem('garja_admin_token');
        localStorage.removeItem('garja_admin');
      }

      // Dispatch custom event for insufficient permissions
      if (typeof window !== 'undefined') {
        console.log('[AXIOS INTERCEPTOR] Dispatching auth:forbidden event');
        window.dispatchEvent(new CustomEvent('auth:forbidden', {
          detail: {
            message: 'You do not have permission to perform this action'
          }
        }));
      }
    }

    // Check for redirect
    if (error.response?.status === 302 || error.response?.status === 301) {
      console.error('[AXIOS INTERCEPTOR] REDIRECT DETECTED!');
      console.error('[AXIOS INTERCEPTOR] Redirect Status:', error.response?.status);
      console.error('[AXIOS INTERCEPTOR] Redirect Location:', error.response?.headers?.location);
    }

    // Check for CORS error
    if (!error.response && error.message) {
      console.error('[AXIOS INTERCEPTOR] NETWORK ERROR (Possible CORS issue)');
      console.error('[AXIOS INTERCEPTOR] Error details:', error.message);
    }

    console.log('==================== DEBUG END - AXIOS RESPONSE ERROR ====================');

    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    signup: async (data: SignupData): Promise<AuthUser> => {
      const response = await api.post('/auth/signup', data);
      return response.data;
    },

    login: async (data: LoginData): Promise<AuthUser> => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },

    resetPassword: async (newPassword: string): Promise<{ email: string; message: string }> => {
      const response = await api.post('/common/reset-password', { newPassword });
      return response.data;
    },
  },

  // Admin product endpoints
  admin: {
    addProduct: async (formData: FormData) => {
      const response = await api.post('/admin/addProduct', formData);
      return response.data;
    },

    updateProduct: async (id: number, formData: FormData) => {
      const response = await api.put(`/admin/updateProduct/${id}`, formData);
      return response.data;
    },

    deleteProduct: async (id: number) => {
      const response = await api.delete(`/admin/deleteProduct/${id}`);
      return response.data;
    },

    getAllProducts: async () => {
      const response = await api.get('/public/getAllProducts');
      return response.data;
    },

    getProductsByCategory: async (category: string) => {
      const response = await api.get('/public/getProductByCategory', {
        params: { category },
      });
      return response.data;
    },

    getLatestProducts: async () => {
      const response = await api.get('/public/getLatestProducts');
      return response.data;
    },

    getProductById: async (id: number) => {
      const response = await api.get(`/public/getProductById/${id}`);
      return response.data;
    },

    // Admin blog endpoints
    addBlog: async (formData: FormData) => {
      const response = await api.post('/admin/addBlog', formData);
      return response.data;
    },

    updateBlog: async (id: number, formData: FormData) => {
      const response = await api.put(`/admin/updateBlog/${id}`, formData);
      return response.data;
    },

    deleteBlog: async (id: number) => {
      const response = await api.delete(`/admin/deleteBlog/${id}`);
      return response.data;
    },

    getAllBlogs: async () => {
      const response = await api.get('/admin/blogs');
      return response.data;
    },

    // Admin settings endpoints
    getSettings: async () => {
      const response = await api.get('/admin/settings');
      return response.data;
    },

    updateGst: async (gstPercentage: number) => {
      const response = await api.put('/admin/settings/gst', { gstPercentage });
      return response.data;
    },

    updateBusinessInfo: async (data: {
      businessName: string;
      businessEmail: string;
      businessMobile: string;
      businessWhatsapp: string;
    }) => {
      const response = await api.put('/admin/settings/business', data);
      return response.data;
    },
  },

  // Generic request methods
  get: async <T = any>(url: string, params?: any): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  },

  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.post(url, data, isFormData ? undefined : { headers: { 'Content-Type': 'application/json' } });
    return response.data;
  },

  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await api.put(url, data, isFormData ? undefined : { headers: { 'Content-Type': 'application/json' } });
    return response.data;
  },

  delete: async <T = any>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },
};

export default api;
