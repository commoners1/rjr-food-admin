import API from "@/config/axios";

export type AttendanceStatus = "APPROVED" | "REJECTED" | "NEED_APPROVAL"

export type AttendanceData = {
  placeName: string;
  zipCode: string;
  lon: number;
  lat: number;
  clockOut?: Date;
}
export class AttendanceAPIs {
  constructor() {}

  public static async getAll(status?: AttendanceStatus) {
    try {
        const { data } = await API.get(`/attendances${status ? `?status=${status}` : ''}`);
        return { data };
    } catch (error) {
        throw error;
    }
  }

  public static async getById(id?: string) {
    try {
        const { data } = await API.get(`/attendances/${id}`);
        return { data };
    } catch (error) {
        throw error;
    }
  }

  public static async getByUserId(userId: string) {
    try {
        const { data } = await API.get(`/attendances/user/${userId}`);
        return { data };
    } catch (error) {
        throw error;
    }
  }

  public static async clockIn(userId: string, attendanceData: AttendanceData) {
    try {
        const { data } = await API.post(`/attendances/clock-in/${userId}`, attendanceData);
        return { data };
    } catch (error) {
        throw error;
    }
  }

  public static async clockOut(userId: string, attendanceData: AttendanceData) {
    try {
        const { data } = await API.post(`/attendances/clock-out/${userId}`, attendanceData);
        return { data };
    } catch (error) {
        throw error;
    }
  }

  public static async approveOrReject(attendanceId: string, status: AttendanceStatus) {
    try {
        const { data } = await API.post(`/attendances/approve-or-reject/${attendanceId}/${status}`);
        return { data };
    } catch (error) {
        throw error;
    }
  }
}
