import API from "@/config/axios";

export class AuthAPIs {
    constructor() {}

    public static async login(data: { email: string; password: string }) {
        const { email, password } = data;
        try {
            // API interceptor already handles response transformation
            const response = await API.post('/auth/login', { email, password });
            return response;
        } catch (error: any) {
            // Error is already transformed by interceptor
            throw error;
        }
    }

    public static async profile() {
        try {
            // API interceptor already handles response transformation
            const response = await API.get('/auth/me');
            return response;
        } catch (error: any) {
            throw error;
        }
    }
    
    public static async logout() {
        try {
            const response = await API.post("/auth/logout");
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public static async register(data: { 
        email: string; 
        password: string; 
        firstName?: string; 
        lastName?: string;
    }) {
        try {
            const response = await API.post('/auth/register', data);
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public static async refreshToken(refreshToken: string) {
        try {
            const response = await API.post('/auth/refresh', { refreshToken });
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public static async updateProfile(data: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    }) {
        try {
            const response = await API.put('/auth/profile', data);
            return response;
        } catch (error: any) {
            throw error;
        }
    }
}