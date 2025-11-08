
import type { DaySetting } from "@/app/(dashboard)/workflow/create/page";

export type Workflow = {
    id: string;
    name: string;
    companyName: string;
    createdAt: Date;
    schedule: DaySetting[];
};

export const companies = [
    { id: "COMP-001", name: "PT. Derajat Utama Kreasi (NOTCH)" },
];

export const workflowsData: Workflow[] = [
    {
        id: "WF-002",
        name: "Hybrid",
        companyName: "PT. Derajat Utama Kreasi (NOTCH)",
        createdAt: new Date("2024-03-20"),
        schedule: [
            { day: 'Monday', type: 'Workday', openHour: '09:00', closeHour: '18:00', workSystem: 'WFO' },
            { day: 'Tuesday', type: 'Workday', openHour: '09:00', closeHour: '18:00', workSystem: 'WFH' },
            { day: 'Wednesday', type: 'Workday', openHour: '09:00', closeHour: '18:00', workSystem: 'WFO' },
            { day: 'Thursday', type: 'Workday', openHour: '09:00', closeHour: '18:00', workSystem: 'WFO' },
            { day: 'Friday', type: 'Workday', openHour: '09:00', closeHour: '18:00', workSystem: 'WFH' },
            { day: 'Saturday', type: 'Day Off', openHour: '', closeHour: '', workSystem: 'WFO' },
            { day: 'Sunday', type: 'Day Off', openHour: '', closeHour: '', workSystem: 'WFO' },
        ]
    }
];

