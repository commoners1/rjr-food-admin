
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format, parseISO, isWeekend } from "date-fns"
import { usersData } from "@/lib/mock-data"

export type AttendanceStatus = "Attend on Weekdays" | "Attend on Weekends" | "Absent";
export type LocationStatus = "GPS In Range" | "GPS Out of Range" | "GPS not Detected";


export type AttendanceRecord = {
    id: string;
    userId: string;
    date: string;
    clockInTime: string | null;
    clockOutTime: string | null;
    duration: number | null; // in seconds
    status: AttendanceStatus;
    clockInLocationStatus: LocationStatus;
    clockOutLocationStatus: LocationStatus | null;
};

const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "-";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
};

const getStatusVariant = (status: AttendanceStatus) => {
    switch (status) {
        case "Attend on Weekdays": return "secondary";
        case "Attend on Weekends": return "outline";
        case "Absent": return "destructive";
        default: return "default";
    }
}

const getLocationStatusVariant = (status: LocationStatus | null) => {
    if (!status) return "default";
    switch (status) {
        case "GPS In Range": return "secondary";
        case "GPS Out of Range": return "destructive";
        case "GPS not Detected": return "outline";
        default: return "default";
    }
}

type ColumnsConfig = {
    showEmployee?: boolean;
}

export const columns = ({ showEmployee = false }: ColumnsConfig): ColumnDef<AttendanceRecord>[] => {
    const baseColumns: ColumnDef<AttendanceRecord>[] = [
        ...(showEmployee ? [{
            accessorKey: "userId",
            header: "Employee",
            cell: ({ row }: { row: any }) => {
                const user = usersData.find(u => u.id === row.original.userId);
                return user ? user.name : 'Unknown';
            }
        }] as ColumnDef<AttendanceRecord>[] : []),
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => row.original.clockInTime ? format(parseISO(row.original.clockInTime), "PP") : '-'
        },
         {
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>
                </div>
            )
        },
        {
            accessorKey: "clockInTime",
            header: () => <div className="text-center">Clock In</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.clockInTime ? (
                        <Badge variant="secondary">{format(parseISO(row.original.clockInTime), "p")}</Badge>
                    ) : "-"}
                </div>
            ),
        },
        {
            accessorKey: "clockInLocationStatus",
            header: () => <div className="text-center">Clock In Location</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Badge variant={getLocationStatusVariant(row.original.clockInLocationStatus)}>{row.original.clockInLocationStatus}</Badge>
                </div>
            )
        },
        {
            accessorKey: "clockOutTime",
            header: () => <div className="text-center">Clock Out</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.clockOutTime ? (
                        <Badge variant="outline">{format(parseISO(row.original.clockOutTime), "p")}</Badge>
                    ) : (
                        <Badge variant="default">In Progress</Badge>
                    )}
                </div>
            ),
        },
         {
            accessorKey: "clockOutLocationStatus",
            header: () => <div className="text-center">Clock Out Location</div>,
            cell: ({ row }) => row.original.clockOutTime ? (
                <div className="text-center">
                    <Badge variant={getLocationStatusVariant(row.original.clockOutLocationStatus)}>{row.original.clockOutLocationStatus}</Badge>
                </div>
            ) : <div className="text-center">-</div>
        },
        {
            accessorKey: "duration",
            header: () => <div className="text-right">Duration</div>,
            cell: ({ row }) => <div className="text-right">{formatDuration(row.original.duration)}</div>
        },
    ];

    return baseColumns;
}
