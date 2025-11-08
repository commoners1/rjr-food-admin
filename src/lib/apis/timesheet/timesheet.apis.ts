import API from "@/config/axios";

export type CreateTimesheet = {
  userId: string;
  description: string;
  clientCompanyId: string;
  clientBrandId: string;
  clientProjectId: string;
};

export type UpdateTimesheet = Partial<
  Omit<CreateTimesheet, "userId">
> & {
  time?: number;
};

export class OvertimeAPIs {
    constructor() {}

    public static async getAll() {
        try {
            const { data } = await API.get('/timesheet');
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/timesheet/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async create(reqData: CreateTimesheet) {
        try {
            const { data } = await API.post(`/timesheet`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, reqData: UpdateTimesheet) {
        try {
            const { data } = await API.put(`/timesheet/${id}`, { ...reqData });
            return data;
        } catch (error) {
            throw error;
        }
    }

    public static async action(id: string, action: "resume" | "pause" | "submit") {
        try {
            const { data } = await API.put(`/timesheet/${id}/${action}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/timesheet/${id}`);
            return data;
        } catch (error) {
            throw error;
        }
    }
}