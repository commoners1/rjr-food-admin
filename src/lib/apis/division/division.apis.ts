import API from "@/config/axios";

export type BaseDivisionData = {
    name: string;
}

export type GetAllDivisionsParams = {
  searchTerm?: string;
  limit?: number;
  offset?: number;
  page?: number;
  sortField?: 'createdAt' | 'name';
  sortDirection?: 'asc' | 'desc';
};

export class DivisionAPIs {
    constructor() {}

    public static async getAll(params: GetAllDivisionsParams = {}) {
        try {
            const { data } = await API.get('/divisions', { params });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async findOne(id: string) {
        try {
            const { data } = await API.get(`/divisions/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: BaseDivisionData) {
        try {
            const { data } = await API.post('/divisions', { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<BaseDivisionData>) {
        try {
            const { data } = await API.put(`/divisions/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/divisions/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }


}