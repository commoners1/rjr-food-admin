import API from "@/config/axios";

export type CreateLeaveBalance = {
    userId: string;
    quotaDays: number;
    usedDays: number;
    startDate: Date;
    endDate: Date;
}

export class LeaveBalanceAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/leave-balance');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/leave-balance/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getByUserId(userId: string) {
        try {
            const { data } = await API.get(`/leave-balance/user/${userId}}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateLeaveBalance) {
        try {
            const { data } = await API.post(`/leave-balance/update-status-and-may-create-next`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateLeaveBalance>) {
        try {
            const { data } = await API.put(`/leave-balance/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/leave-balance/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}