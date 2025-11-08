import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import 'dotenv/config';
import { usersData } from "@/lib/mock-data";

// Enable mock mode when API is not available
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL;

// Mock mode is enabled when API URL is not set or explicitly enabled

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
  // ========== AUTH ENDPOINTS ==========
  if (url.includes('/auth/login') && method === 'post') {
    const { email, password } = data || {};
    
    // Find user from mock data
    const userToLogin = usersData.find(
      (u) => u.email.toLowerCase() === email?.toLowerCase() && u.password === password
    );

    if (!userToLogin) {
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid email or password' },
        },
      };
    }

    // Extract only User type properties (exclude password, jobPosition, birthDate)
    const userData = {
      id: userToLogin.id,
      name: userToLogin.name,
      email: userToLogin.email,
      role: userToLogin.role,
      isActive: userToLogin.isActive,
      division: userToLogin.division,
      avatar: userToLogin.avatar,
      managerId: userToLogin.managerId,
    };

    return {
      data: {
        user: userData,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      },
    };
  }

  if (url.includes('/auth/me') && method === 'get') {
    // Try to get user from localStorage (set during login)
    let userData = null;
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('currentUserId');
      if (storedUserId) {
        const user = usersData.find((u) => u.id === storedUserId);
        if (user) {
          userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            division: user.division,
            avatar: user.avatar,
            managerId: user.managerId,
          };
        }
      }
    }

    // Default to first user if no user found
    if (!userData && usersData.length > 0) {
      const defaultUser = usersData[0];
      userData = {
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email,
        role: defaultUser.role,
        isActive: defaultUser.isActive,
        division: defaultUser.division,
        avatar: defaultUser.avatar,
        managerId: defaultUser.managerId,
      };
    }

    return {
      data: {
        user: userData,
      },
    };
  }

  if (url.includes('/auth/logout') && method === 'post') {
    return { data: { success: true } };
  }

  // ========== PRODUCTS/MENU ENDPOINTS ==========
  if (url.includes('/products') || url.includes('/menu')) {
    if (method === 'get') {
      return {
        data: {
          products: [
            { id: '1', name: 'Spicy Ramen', price: 45000, category: 'Main Course', status: 'active', image: 'https://placehold.co/200x200?text=Ramen' },
            { id: '2', name: 'Gourmet Burger', price: 75000, category: 'Main Course', status: 'active', image: 'https://placehold.co/200x200?text=Burger' },
            { id: '3', name: 'Margherita Pizza', price: 80000, category: 'Main Course', status: 'active', image: 'https://placehold.co/200x200?text=Pizza' },
            { id: '4', name: 'Caesar Salad', price: 45000, category: 'Appetizer', status: 'active', image: 'https://placehold.co/200x200?text=Salad' },
            { id: '5', name: 'Fresh Lemonade', price: 15000, category: 'Drinks', status: 'active', image: 'https://placehold.co/200x200?text=Drink' },
          ],
          total: 5,
        },
      };
    }
    if (method === 'post') {
      return { data: { id: Date.now().toString(), ...data, status: 'active' } };
    }
    if (method === 'put' || method === 'patch') {
      return { data: { ...data, updatedAt: new Date().toISOString() } };
    }
    if (method === 'delete') {
      return { data: { success: true } };
    }
  }

  // ========== ORDERS ENDPOINTS ==========
  if (url.includes('/orders')) {
    if (method === 'get') {
      return {
        data: {
          orders: [
            { id: 'ORD-001', orderNumber: 'RJR-2024-001234', customer: 'John Doe', total: 250000, status: 'preparing', createdAt: '2024-01-15T10:30:00Z', items: 3 },
            { id: 'ORD-002', orderNumber: 'RJR-2024-001235', customer: 'Jane Smith', total: 180000, status: 'delivered', createdAt: '2024-01-15T09:15:00Z', items: 2 },
            { id: 'ORD-003', orderNumber: 'RJR-2024-001236', customer: 'Bob Johnson', total: 320000, status: 'pending', createdAt: '2024-01-15T11:00:00Z', items: 4 },
          ],
          total: 3,
        },
      };
    }
    if (method === 'get' && url.includes('/orders/')) {
      const orderId = url.split('/orders/')[1]?.split('?')[0];
      return {
        data: {
          id: orderId,
          orderNumber: 'RJR-2024-001234',
          customer: { id: '1', name: 'John Doe', email: 'john@example.com' },
          items: [
            { id: '1', product: 'Spicy Ramen', quantity: 2, price: 45000 },
            { id: '2', product: 'Fresh Lemonade', quantity: 1, price: 15000 },
          ],
          total: 250000,
          status: 'preparing',
          createdAt: '2024-01-15T10:30:00Z',
        },
      };
    }
    if (method === 'put' || method === 'patch') {
      return { data: { ...data, updatedAt: new Date().toISOString() } };
    }
  }

  // ========== CUSTOMERS ENDPOINTS ==========
  if (url.includes('/customers')) {
    if (method === 'get') {
      return {
        data: {
          customers: [
            { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+62 123 456 7890', totalOrders: 12, totalSpent: 2500000, status: 'active', joinedDate: '2024-01-01' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+62 987 654 3210', totalOrders: 8, totalSpent: 1800000, status: 'active', joinedDate: '2024-01-15' },
            { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+62 555 123 4567', totalOrders: 5, totalSpent: 1200000, status: 'active', joinedDate: '2024-02-01' },
          ],
          total: 3,
        },
      };
    }
  }

  // ========== REVIEWS ENDPOINTS ==========
  if (url.includes('/reviews')) {
    if (method === 'get') {
      return {
        data: {
          reviews: [
            { id: '1', product: 'Spicy Ramen', user: 'John Doe', rating: 5, comment: 'Amazing! Best ramen I\'ve ever had.', sentiment: 'positive', sentimentScore: 0.95, createdAt: '2024-01-15T10:30:00Z' },
            { id: '2', product: 'Gourmet Burger', user: 'Jane Smith', rating: 4, comment: 'Good burger, but a bit too expensive.', sentiment: 'neutral', sentimentScore: 0.65, createdAt: '2024-01-14T15:20:00Z' },
            { id: '3', product: 'Margherita Pizza', user: 'Bob Johnson', rating: 5, comment: 'Perfect pizza! Will order again.', sentiment: 'positive', sentimentScore: 0.92, createdAt: '2024-01-13T12:10:00Z' },
          ],
          total: 3,
          averageRating: 4.67,
        },
      };
    }
  }

  // ========== PROMOTIONS ENDPOINTS ==========
  if (url.includes('/promotions') || url.includes('/promos')) {
    if (method === 'get') {
      return {
        data: {
          promotions: [
            { id: '1', code: 'WELCOME10', name: 'Welcome Discount', type: 'PERCENTAGE', discountPercentage: 10, minPurchaseAmount: 100000, validFrom: '2024-01-01', validUntil: '2024-12-31', currentUses: 45, maxUses: 1000, isActive: true },
            { id: '2', code: 'FREESHIP', name: 'Free Shipping', type: 'FREE_SHIPPING', minPurchaseAmount: 50000, validFrom: '2024-01-15', validUntil: '2024-02-15', currentUses: 120, maxUses: 500, isActive: true },
          ],
          total: 2,
        },
      };
    }
    if (method === 'post') {
      return { data: { id: Date.now().toString(), ...data, isActive: true } };
    }
  }

  // ========== BANNERS ENDPOINTS ==========
  if (url.includes('/banners')) {
    if (method === 'get') {
      return {
        data: {
          banners: [
            { id: '1', title: 'Summer Special', image: 'https://placehold.co/800x300?text=Banner1', link: '/promotions', isActive: true, order: 1 },
            { id: '2', title: 'New Menu Items', image: 'https://placehold.co/800x300?text=Banner2', link: '/menu', isActive: true, order: 2 },
          ],
          total: 2,
        },
      };
    }
  }

  // ========== MEDIA ENDPOINTS ==========
  if (url.includes('/media') || url.includes('/uploads')) {
    if (method === 'get') {
      return {
        data: {
          files: [
            { id: '1', name: 'product-image-1.jpg', url: 'https://placehold.co/200x200?text=Image1', type: 'image', size: 102400, uploadedAt: '2024-01-15T10:30:00Z' },
            { id: '2', name: 'product-image-2.jpg', url: 'https://placehold.co/200x200?text=Image2', type: 'image', size: 98304, uploadedAt: '2024-01-14T15:20:00Z' },
          ],
          total: 2,
        },
      };
    }
    if (method === 'post') {
      return { data: { id: Date.now().toString(), url: 'https://placehold.co/200x200?text=Uploaded', ...data } };
    }
  }

  // ========== DASHBOARD/ANALYTICS ENDPOINTS ==========
  if (url.includes('/dashboard') || url.includes('/analytics') || url.includes('/stats')) {
    if (method === 'get') {
      return {
        data: {
          todayStats: { revenue: 12500000, orders: 45, customers: 38, growth: 12.5 },
          salesData: [
            { day: 'Mon', sales: 4500000 },
            { day: 'Tue', sales: 5200000 },
            { day: 'Wed', sales: 4800000 },
            { day: 'Thu', sales: 6100000 },
            { day: 'Fri', sales: 5500000 },
            { day: 'Sat', sales: 7200000 },
            { day: 'Sun', sales: 6800000 },
          ],
        },
      };
    }
  }

  // ========== FINANCE ENDPOINTS ==========
  if (url.includes('/finance') || url.includes('/ledger')) {
    if (method === 'get') {
      return {
        data: {
          revenueData: [
            { month: 'Jan', revenue: 45000000, expenses: 30000000 },
            { month: 'Feb', revenue: 52000000, expenses: 32000000 },
            { month: 'Mar', revenue: 48000000, expenses: 31000000 },
          ],
          ledgerEntries: [
            { id: '1', date: '2024-01-15', description: 'Order #ORD-001 Payment', type: 'credit', amount: 250000, status: 'settled' },
            { id: '2', date: '2024-01-15', description: 'Supplier Payment', type: 'debit', amount: 1500000, status: 'pending' },
          ],
        },
      };
    }
  }

  // ========== KDS ENDPOINTS ==========
  if (url.includes('/kds') || url.includes('/kitchen')) {
    if (method === 'get') {
      return {
        data: {
          orders: [
            { id: 'ORD-001', status: 'preparing', items: ['Spicy Ramen', 'Fresh Lemonade'], time: '5 min' },
            { id: 'ORD-002', status: 'ready', items: ['Gourmet Burger'], time: 'Ready' },
            { id: 'ORD-003', status: 'pending', items: ['Margherita Pizza'], time: '2 min' },
          ],
        },
      };
    }
  }

  // ========== DEFAULT RESPONSE ==========
  // For any other endpoint, return a generic success response
  return { data: { success: true, data: method === 'get' ? [] : {}, message: 'Mock data response' } };
};

// Custom adapter for mock mode - prevents actual network requests
const mockAdapter = (config: InternalAxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    // Get the URL path (remove baseURL if present)
    const url = config.url || '';
    const urlPath = url.replace(baseURL, '').replace(/^\/+/, '/');
    
    try {
      const mockResponse = getMockResponse(
        urlPath,
        config.method?.toUpperCase() || 'get',
        config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : config.data
      );
      
      // Create a fake axios response
      const axiosResponse = {
        data: mockResponse.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
      
      resolve(axiosResponse);
    } catch (error: any) {
      // Handle errors thrown by getMockResponse (e.g., invalid login)
      if (error?.response) {
        reject({
          response: {
            ...error.response,
            config,
          },
        });
      } else {
        reject(error);
      }
    }
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
    // Check if this is a mock response (has the mock adapter signature)
    // Mock adapter returns: { data: { user: {...}, accessToken: ... }, status: 200, ... }
    // So response.data should be { user: {...}, accessToken: ... }
    
    // For mock data, return the data directly (mock adapter already structures it correctly)
    // We can detect mock by checking if adapter was used (response has our mock structure)
    if (response.data && typeof response.data === 'object' && 'user' in response.data) {
      // This looks like a mock login response
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
