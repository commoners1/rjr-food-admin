import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import 'dotenv/config';

// Enable mock mode when API is not available
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// Log mock mode status (only in browser)
if (typeof window !== 'undefined') {
  console.log('🔧 Mock mode enabled:', USE_MOCK_DATA);
  console.log('🔧 NEXT_PUBLIC_USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA);
  console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

// Get API URL from environment variable, default to localhost if not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Ensure baseURL includes /api prefix
// If API_URL already ends with /api, use it as is, otherwise append /api
const baseURL = API_URL.endsWith('/api') 
  ? API_URL 
  : API_URL.endsWith('/') 
    ? `${API_URL}api` 
    : `${API_URL}/api`;

// Mock data responses function (must be defined before adapter)
const getMockResponse = (url: string, method: string, data?: any) => {
  // Mock login response
  if (url.includes('/auth/login') && method === 'post') {
    return {
      data: {
        user: {
          id: '1',
          name: 'Admin User',
          email: data?.email || 'admin@example.com',
          role: { id: '1', name: 'Admin' },
          isActive: true,
          division: { id: '1', name: 'Management' },
          avatar: 'https://placehold.co/100x100?text=AU',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  }

  // Mock profile response
  if (url.includes('/auth/me') && method === 'get') {
    return {
      data: {
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: { id: '1', name: 'Admin' },
          isActive: true,
          division: { id: '1', name: 'Management' },
          avatar: 'https://placehold.co/100x100?text=AU',
        },
      },
    };
  }

  // Mock logout response
  if (url.includes('/auth/logout') && method === 'post') {
    return { data: { success: true } };
  }

  // Default mock response
  return { data: { success: true, data: {} } };
};

// Custom adapter for mock mode - prevents actual network requests
const mockAdapter = (config: InternalAxiosRequestConfig) => {
  return new Promise((resolve) => {
    // Get the URL path (remove baseURL if present)
    const url = config.url || '';
    const urlPath = url.replace(baseURL, '').replace(/^\/+/, '/');
    
    console.log('🔄 Using mock data for:', url);
    console.log('🔄 URL path:', urlPath);
    console.log('🔄 Method:', config.method?.toUpperCase() || 'get');
    
    const mockResponse = getMockResponse(
      urlPath,
      config.method?.toUpperCase() || 'get',
      config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : config.data
    );
    
    console.log('📦 Mock response data:', mockResponse.data);
    
    // Create a fake axios response
    const axiosResponse = {
      data: mockResponse.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
    
    console.log('✅ Mock adapter returning:', axiosResponse);
    resolve(axiosResponse);
  });
};

const options = {
  baseURL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'api-version': 'v1', // Add API version header
  },
  ...(USE_MOCK_DATA && { adapter: mockAdapter }),
};

const API = axios.create(options);

// Request interceptor - add auth token if available (only when not using mock)
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip if using mock data
    if (USE_MOCK_DATA) {
      return config;
    }

    // Add auth token from localStorage/cookies if available
    if (typeof window !== 'undefined') {
      // Try localStorage first
      let token = localStorage.getItem('accessToken');
      
      // If not in localStorage, try cookies
      if (!token) {
        const cookieToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          ?.split('=')[1];
        token = cookieToken || null;
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and transform responses
API.interceptors.response.use(
  (response) => {
    console.log('📥 Response interceptor received:', response);
    console.log('📥 Response.data:', response.data);
    
    // Check if this is a mock response (has the mock adapter signature)
    // Mock adapter returns: { data: { user: {...}, accessToken: ... }, status: 200, ... }
    // So response.data should be { user: {...}, accessToken: ... }
    
    // For mock data, return the data directly (mock adapter already structures it correctly)
    // We can detect mock by checking if adapter was used (response has our mock structure)
    if (response.data && typeof response.data === 'object' && 'user' in response.data) {
      // This looks like a mock login response
      console.log('✅ Detected mock response, returning:', response.data);
      return response.data;
    }
    
    // Backend returns { success: true, data: {...}, timestamp: "..." }
    // Return the data directly for easier consumption
    if (response.data && typeof response.data === 'object') {
      if ('data' in response.data) {
        return response.data.data;
      }
      if ('success' in response.data && response.data.success) {
        return response.data.data || response.data;
      }
    }
    console.log('⚠️ Returning response.data or response:', response.data || response);
    return response.data || response;
  },
  async (error: AxiosError) => {
    const { response, request, config } = error;

    // Handle network errors - return mock data if enabled (fallback)
    if (!response) {
      if (USE_MOCK_DATA) {
        console.log('🔄 Using mock data (fallback) for:', config?.url);
        const mockResponse = getMockResponse(
          config?.url || '',
          config?.method?.toUpperCase() || 'get',
          config?.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : undefined
        );
        const mockData = mockResponse.data;
        if (mockData && typeof mockData === 'object' && 'data' in mockData) {
          return mockData.data;
        }
        return mockData;
      }
      
      console.error('Network Error:', request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection and ensure the API server is running.',
        data: null,
      });
    }

    // Handle HTTP errors
    const { status, data } = response;
    
    // Handle 401 Unauthorized - redirect to login
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Return standardized error format
    const errorData = data as any;
    return Promise.reject({
      status,
      message: errorData?.message || errorData?.error || `Request failed with status code ${status}`,
      data: errorData?.data || errorData,
    });
  }
);

export default API;
