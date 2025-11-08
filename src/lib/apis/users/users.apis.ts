import API from "@/config/axios";

export type CreateUser = {
    name: string;
    email: string;
    password: string;
    roleId: string;
    divisionId: string;
    salary?: number;
    avatar?: string | null;
    birthday?: string;
    isActive?: boolean;
    jobPosition?: string;
}

export type UpdateUser = Partial<CreateUser>;

export type GetAllUsersParams = {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortField?: 'createdAt' | 'email' | 'name';
  sortDirection?: 'asc' | 'desc';
  roleId?: string;
  divisionId?: string;
  isActive?: boolean;
};

export class UsersAPIs {
    constructor() {}

    public static async getAll(params: GetAllUsersParams = {}) {
        try {
            const { data } = await API.get('/users', { params });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(userData: CreateUser) {
        try {
            const { data } = await API.post('/users', userData);
            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public static async findOne(id: string) {
        try {
            const { data } = await API.post(`/users/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, userData: UpdateUser) {
        try {
            const { data } = await API.patch(`/users/${id}`, userData);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/users/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}