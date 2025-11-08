import API from "@/config/axios";

export type CreateOvertimeType = {
    name: string;
    allowance?: string[]; 
}

export class OvertimeTypeAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/overtime-type');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/overtime-type/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateOvertimeType) {
        try {
            const { data } = await API.post(`/overtime-type`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateOvertimeType>) {
        try {
            const { data } = await API.put(`/overtime-type/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/overtime-type/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}