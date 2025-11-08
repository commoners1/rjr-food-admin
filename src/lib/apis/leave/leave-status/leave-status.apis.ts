import API from "@/config/axios";

export type CreateLeaveStatus = {
    name: string;
}

export class LeaveStatusAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/leave-status');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/leave-status/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateLeaveStatus) {
        try {
            const { data } = await API.put(`/leave-status/update-status-and-may-create-next`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateLeaveStatus>) {
        try {
            const { data } = await API.put(`/leave-status/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/leave-status/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}