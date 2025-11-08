import API from "@/config/axios";


export type CreateOvertime = {
    userId: string;
    overtimeTypeId: string;
    approvalFlow: object;
    date: Date;
    startAt: Date;
    endAt: Date;
    reason: string;
    compensatoryDayOff?: Date;
    allowance?: object;
}
export class OvertimeAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/overtime');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/overtime/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getByApprovalRoleAndStatus(roleId: string, status: string) {
        try {
            const { data } = await API.get(`/overtime/approval-role/${roleId}/status/${status}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateOvertime) {
        try {
            const { data } = await API.post(`/overtime`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: Partial<CreateOvertime>) {
        try {
            const { data } = await API.put(`/overtime/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/overtime/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}