import API from "@/config/axios";

export type CreateClientProject = {
  name: string;
  brandId: string;
};

export type UpdateClientProject = Partial<
  Omit<CreateClientProject, "brandId">
>;

export class ClientProjectAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/client-project');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/client-project/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateClientProject) {
        try {
            const { data } = await API.post(`/client-project`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: UpdateClientProject) {
        try {
            const { data } = await API.put(`/client-project/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/client-project/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}