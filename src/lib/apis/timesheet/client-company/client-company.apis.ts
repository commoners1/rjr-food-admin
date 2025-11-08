import API from "@/config/axios";

export type CreateClientCopmany = {
  name: string;
};

export class ClientCompanyAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/client-company');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/client-company/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateClientCopmany) {
        try {
            const { data } = await API.post(`/client-company`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateClientCopmany>) {
        try {
            const { data } = await API.put(`/client-company/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/client-company/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}