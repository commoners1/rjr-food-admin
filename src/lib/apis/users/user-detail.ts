import API from "@/config/axios";

export type CreateUserDetail = {
    userId: string;
    BankAccount?: string;
    BankName?: string;
    phone?: string;
}

export type GetAllUserDetailsParams = {
  limit?: number;
  offset?: number;
  page?: number;
  sortField?: 'createdAt' | 'email' | 'name';
  sortDirection?: 'asc' | 'desc';
};

export class UserDetailsAPI {
    constructor() {}

    public static async getAll(params: GetAllUserDetailsParams = {}) {
        try {
            const { data } = await API.get('/user-details', {params});
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/user-details/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateUserDetail) {
        try {
            const { data } = await API.post(`/user-details`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateUserDetail>) {
        try {
            const { data } = await API.put(`/user-details/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/user-details/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}