import API from "@/config/axios";

export type BaseAddressData = {
    userId?: string;
    companyId?: string;
    placeName: string;
    zipCode: string;
    lon: number;
    lat: number;
    isApprovalAttendance?: boolean;
}

export class AddressAPIs {
    public static async getAll() {
        try {
            const { data } = await API.get(`/addresses`);
            return { data };
        } catch (error) {
            throw error;
        }
    }

    public static async getById(id: string) {
        try {
            const { data } = await API.get(`/addresses/${id}`);
            return { data };
        } catch (error) {
            throw error;
        }
    }

    public static async getByType(type: "company" | "user") {
        try {
            const { data } = await API.get(`/addresses/type/${type}`);
            return { data };
        } catch (error) {
            throw error;
        }
    }

    public static async create(addressData: BaseAddressData) {
        try {
            const { data } = await API.post(`/addresses`, addressData);
            return { data };
        } catch (error) {
            throw error;
        }
    }

    public static async update(id: string, addressData: Partial<BaseAddressData>) {
        try {
            const { data } = await API.put(`/addresses/${id}`, addressData);
            return { data };
        } catch (error) {
            throw error;
        }
    }
    public static async delete(id: string) {
        try {
            const { data } = await API.delete(`/addresses/${id}`);
            return { data };
        } catch (error) {
            throw error;
        }
    }
}