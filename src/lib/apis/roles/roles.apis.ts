import API from "@/config/axios";

export type CreateRole = {
    name: string;
}

export type RoleQueryParams = {
  searchTerm?: string;
  limit?: number;
  page?: number;
  offset?: number;
  sortField?: 'createdAt' | 'name';
  sortDirection?: 'asc' | 'desc';
};

export class RolesAPIs {
    constructor() {}

    public static async getAll(params: RoleQueryParams = {}) {
        try {
            const { data } = await API.get('/roles', { params });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/roles/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateRole) {
        try {
            const { data } = await API.post(`/roles`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateRole>) {
        try {
            const { data } = await API.patch(`/roles/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/roles/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}