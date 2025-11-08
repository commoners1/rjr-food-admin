import API from "@/config/axios";

export type ApprovalStatuses = "APPROVED" | "REJECTED" | "PENDING" | "FINAL_APPROVED";

export type UpdateStatusAndMayCreateNext = {
    id: string;
    userId: string;
    status: ApprovalStatuses;
}

export class LeaveApprovalAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/leave-approval');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/leave-approval/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getAllByUserAndStatus(userId: string, status?: ApprovalStatuses) {
        try {
            const { data } = await API.get(`/leave-approval/user/${userId}?status=${status}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async updateAndMayCreateNext(reqData: UpdateStatusAndMayCreateNext) {
        try {
            const { data } = await API.put(`/leave-approval/update-status-and-may-create-next`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/leave-approval/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}