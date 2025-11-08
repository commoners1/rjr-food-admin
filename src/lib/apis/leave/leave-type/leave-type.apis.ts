import API from "@/config/axios";

export type CreateLeaveType = {
    name: string;
    approvalFlow: any;
}

export class LeaveTypeAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/leave-type');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/leave-type/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateLeaveType) {
        try {
            const { data } = await API.post(`/leave-type/update-status-and-may-create-next`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateLeaveType>) {
        try {
            const { data } = await API.put(`/leave-type/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/leave-type/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}