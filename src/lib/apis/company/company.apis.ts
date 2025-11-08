import API from "@/config/axios";

export type BaseCompanyData = {
    name: string;
    npwp: string;
}

export class AuthAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/company');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async findOne(id: string) {
        try {
            const { data } = await API.get(`/company/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: BaseCompanyData) {
        try {
            const { data } = await API.post('/company', { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<BaseCompanyData>) {
        try {
            const { data } = await API.put(`/company/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/company/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }


}