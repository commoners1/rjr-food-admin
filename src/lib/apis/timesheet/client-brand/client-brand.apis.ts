import API from "@/config/axios";

export type CreateClientBrand = {
  name: string;
  companyId: string;
};

export type UpdateClientBrand = Partial<
  Omit<CreateClientBrand, "companyId">
>;

export class ClientBrandAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/client-brand');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/client-brand/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateClientBrand) {
        try {
            const { data } = await API.post(`/client-brand`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: UpdateClientBrand) {
        try {
            const { data } = await API.put(`/client-brand/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/client-brand/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}