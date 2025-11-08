
"use client";

import { useState, useEffect } from 'react';
import { useUser } from './use-user';
import { kpiData, usersData, reimbursementData, leaveData, overtimeData, timesheetData } from "@/lib/mock-data";
import { isToday } from "date-fns";
import type { User } from "@/types/user";

// Stub type for LeaveRequest
interface LeaveRequest {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  type: string;
  status: string;
  days: number;
  reason: string;
}

const TOTAL_LEAVE_DAYS = 20; 

export type DashboardData = {
    employeeKPIs: {
        remainingLeave: number;
        pendingReimbursement: number;
        approvedOvertime: number;
        hoursToday: number;
        pendingLeave: number;
        pendingOvertime: number;
    };
    managerKPIs: {
        teamOnLeave: number;
        pendingLeave: number;
        pendingOvertime: number;
        pendingReimbursement: number;
    };
    approvalKPIs: {
        pendingLeave: number;
        pendingOvertime: number;
        pendingReimbursement: number;
    };
    financeKPIs: {
        pendingOvertime: number;
        pendingReimbursement: number;
    };
    globalKPIs: {
        activeUsers: number;
        inventoryValue: typeof kpiData.inventoryValue;
        pendingReimbursements: number;
        onLeaveToday: number;
    },
    myLeaveData: LeaveRequest[];
    myCalendarUsers: User[];
    teamLeaveData: LeaveRequest[];
    teamCalendarUsers: User[];
    teamCalendarTitle: string;
};

export function useDashboardData() {
    const { user } = useUser();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            
            // This is a complex function and in a real-world app would be handled by a backend service.
            // For this demo, we are simulating the data aggregation on the client.
            const getDashboardData = (): DashboardData | null => {``
                const today = new Date();
                const approvedLeave = leaveData.filter(r => r.status === 'Approved');
                const onLeaveToday = approvedLeave.filter(r => today >= new Date(r.startDate) && today <= new Date(r.endDate)).length;

                // Employee specific KPIs (for all roles)
                const myLeaveRequests = leaveData.filter(r => r.userId === user.id);
                const approvedLeaveDays = myLeaveRequests
                    .filter((r) => r.status === "Approved")
                    .reduce((sum, r) => sum + r.days, 0);
                const remainingLeave = TOTAL_LEAVE_DAYS - approvedLeaveDays;

                const myReimbursements = reimbursementData.filter(r => r.userId === user.id && r.status.startsWith('Pending'));
                const pendingReimbursement = myReimbursements.length;

                const myOvertime = overtimeData.filter(r => r.userId === user.id);
                const approvedOvertime = myOvertime
                    .filter(r => r.status === 'Approved' || r.status === 'Paid')
                    .reduce((sum, r) => sum + r.hours, 0);

                const myTimesheet = timesheetData.filter(r => r.userId === user.id && isToday(new Date(r.date)));
                const hoursToday = myTimesheet.reduce((sum, r) => sum + r.hours, 0);
                
                const pendingLeave = myLeaveRequests.filter(r => r.status.startsWith('Pending')).length;
                const pendingOvertime = myOvertime.filter(r => r.status.startsWith('Pending')).length;

                const employeeKPIs = {
                    remainingLeave,
                    pendingReimbursement,
                    approvedOvertime,
                    hoursToday,
                    pendingLeave,
                    pendingOvertime,
                };

                // Calendar data
                let myLeaveData: LeaveRequest[] = [];
                let myCalendarUsers: User[] = [];
                let teamLeaveData: LeaveRequest[] = [];
                let teamCalendarUsers: User[] = [];
                let teamCalendarTitle: string = "Team Leave";
                
                myLeaveData = approvedLeave.filter(r => r.userId === user.id);
                myCalendarUsers = usersData.filter(u => u.id === user.id);


                // Role-specific KPIs
                let managerKPIs = { teamOnLeave: 0, pendingLeave: 0, pendingOvertime: 0, pendingReimbursement: 0 };
                let approvalKPIs = { pendingLeave: 0, pendingOvertime: 0, pendingReimbursement: 0 };
                let financeKPIs = { pendingOvertime: 0, pendingReimbursement: 0 };

                const myTeamIds = usersData.filter(u => u.managerId === user.id).map(u => u.id);

                if (user.role === 'Manager') {
                    teamLeaveData = approvedLeave.filter(r => myTeamIds.includes(r.userId));
                    teamCalendarUsers = usersData.filter(u => myTeamIds.includes(u.id));

                    const teamOnLeave = approvedLeave.filter(r => myTeamIds.includes(r.userId) && today >= new Date(r.startDate) && today <= new Date(r.endDate)).length;
                    const pendingLeave = leaveData.filter(r => myTeamIds.includes(r.userId) && r.status === 'Pending Manager').length;
                    const pendingOvertime = overtimeData.filter(r => myTeamIds.includes(r.userId) && r.status === 'Pending Manager').length;
                    const pendingReimbursement = reimbursementData.filter(r => myTeamIds.includes(r.userId) && r.status === 'Pending Manager').length;

                    managerKPIs = { teamOnLeave, pendingLeave, pendingOvertime, pendingReimbursement };
                } else if (user.role === 'Employee') {
                    const manager = usersData.find(u => u.id === user.managerId);
                    if (manager) {
                        teamLeaveData = approvedLeave.filter(r => r.userId === manager.id);
                        teamCalendarUsers = [manager];
                        teamCalendarTitle = "Manager's Leave";
                    }
                } else if (['Director', 'HR', 'Admin'].includes(user.role)) {
                    teamLeaveData = approvedLeave.filter(r => r.userId !== user.id);
                    teamCalendarUsers = usersData.filter(u => u.id !== user.id);
                    teamCalendarTitle = "Company Leave";
                }
                
                // Approval KPIs for HR / Director
                if (user.role === 'HR' || user.role === 'Director') {
                    const canApproveLeave = (request: LeaveRequest) => {
                        const requester = usersData.find(u => u.id === request.userId);
                        if (!requester) return false;
                        if (user.role === 'HR' && (requester.role === 'Manager' || requester.role === 'Employee') && request.status === 'Pending HR') return true;
                        if (user.role === 'Director' && ((requester.role === 'Employee' && request.status === 'Pending Director') || (['Manager', 'HR'].includes(requester.role) && request.status === 'Pending Manager'))) return true;
                        return false;
                    };
                    const canApproveOvertime = (request: OvertimeRequest) => {
                         const requester = usersData.find(u => u.id === request.userId);
                         if (!requester) return false;
                         if (user.role === 'HR' && (requester.role === 'Manager' || requester.role === 'Employee') && request.status === 'Pending HR') return true;
                         if (user.role === 'Director' && ((requester.role === 'Employee' && request.status === 'Pending Director') || (['Manager', 'HR'].includes(requester.role) && request.status === 'Pending Manager'))) return true;
                         return false;
                    }
                    const canApproveReimbursement = (request: ReimbursementRequest) => {
                        const requester = usersData.find(u => u.id === request.userId);
                         if (!requester) return false;
                         if (user.role === 'HR' && (requester.role === 'Manager' || requester.role === 'Employee') && request.status === 'Pending HR') return true;
                         if (user.role === 'Director' && ((requester.role === 'Employee' && request.status === 'Pending Director') || (['Manager', 'HR'].includes(requester.role) && request.status === 'Pending Manager'))) return true;
                         return false;
                    }
                    approvalKPIs = {
                        pendingLeave: leaveData.filter(canApproveLeave).length,
                        pendingOvertime: overtimeData.filter(canApproveOvertime).length,
                        pendingReimbursement: reimbursementData.filter(canApproveReimbursement).length,
                    }
                }
                
                // Finance KPIs
                if (user.role === 'Finance') {
                    financeKPIs = {
                        pendingOvertime: overtimeData.filter(r => r.status === 'Approved' && r.type === 'Weekday').length,
                        pendingReimbursement: reimbursementData.filter(r => r.status === 'Approved').length,
                    }
                    teamLeaveData = approvedLeave.filter(r => r.userId !== user.id);
                    teamCalendarUsers = usersData.filter(u => u.id !== user.id);
                    teamCalendarTitle = "Company Leave";
                }

                // Global KPIs
                const activeUsers = usersData.filter(u => u.status === 'Active').length;
                const totalPendingReimbursements = reimbursementData.filter(r => r.status.startsWith('Pending')).length;

                const globalKPIs = {
                    activeUsers,
                    inventoryValue: kpiData.inventoryValue,
                    pendingReimbursements: totalPendingReimbursements,
                    onLeaveToday
                };

                return {
                    employeeKPIs,
                    managerKPIs,
                    approvalKPIs,
                    financeKPIs,
                    globalKPIs,
                    myLeaveData,
                    myCalendarUsers,
                    teamLeaveData,
                    teamCalendarUsers,
                    teamCalendarTitle
                };
            }
            
            const calculatedData = getDashboardData();
            setData(calculatedData);
            setIsLoading(false);
        }
    }, [user]);

    return { data, isLoading };
}
