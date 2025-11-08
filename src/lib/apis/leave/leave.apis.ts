import API from "@/config/axios";


export type CreateLeave = {
    userId: string;
    typeId: string;
    statusId: string;
    startLeave: Date;
    endLeave: Date;
    reason?: string;
    attachment?: string;
}

export class LeaveAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/leave');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/leave/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getAllByUserId(userId: string) {
        try {
            const { data } = await API.get(`/leave/user/${userId}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(userId: string, reqData: CreateLeave) {
        try {
            const { data } = await API.post(`/leave/user/${userId}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/leave/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}