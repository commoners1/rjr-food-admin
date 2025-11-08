import { format, isWeekend } from "date-fns";
import type { User } from "@/types/user";
import type { AttendanceRecord } from "@/app/(dashboard)/attendance/columns";

// Stub types for old ERP modules (kept for backward compatibility with mock data)
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

interface SalaryData {
  id: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface OvertimeRequest {
  id: string;
  [key: string]: any;
}

interface ReimbursementRequest {
  id: string;
  [key: string]: any;
}

interface MedicalRequest {
  id: string;
  [key: string]: any;
}

interface JobOrder {
  id: string;
  [key: string]: any;
}

interface Division {
  id: string;
  [key: string]: any;
}

interface Location {
  id: string;
  [key: string]: any;
}

interface OvertimeType {
  id: string;
  [key: string]: any;
}


export const kpiData = {
  totalRevenue: { value: "$4,295,831.00", change: "+20.1% from last month" },
  expenses: { value: "$1,234,567.00", change: "-5.2% from last month" },
  profitMargin: { value: "71.2%", change: "+2.3% from last month" },
  inventoryValue: { value: "Rp 125,188,815,000", change: "+1.5% from last month" },
};

export const salesData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export const topProductsData = [
  {
    id: "PROD-001",
    name: "Quantum-Leap Laptop",
    sales: 45,
    revenue: 54000,
    avatar: "https://placehold.co/40x40"
  },
  {
    id: "PROD-002",
    name: "Fusion Core Mouse",
    sales: 32,
    revenue: 1600,
    avatar: "https://placehold.co/40x40"
  },
  {
    id: "PROD-003",
    name: "Stellar-Glide Keyboard",
    sales: 28,
    revenue: 3920,
    avatar: "https://placehold.co/40x40"
  },
  {
    id: "PROD-004",
    name: "Nova-Pixel Monitor",
    sales: 21,
    revenue: 12600,
    avatar: "https://placehold.co/40x40"
  },
  {
    id: "PROD-005",
    name: "Cyber-Weave Cable",
    sales: 115,
    revenue: 2300,
    avatar: "https://placehold.co/40x40"
  },
];

export const inventoryData = [
    {
      id: 'INV-001',
      productName: 'Quantum-Leap Laptop',
      sku: 'QL-LAP-2024',
      stockLevel: 15,
      cost: 12750000,
      value: 191250000,
      status: 'In Stock' as const,
    },
    {
      id: 'INV-002',
      productName: 'Fusion Core Mouse',
      sku: 'FC-MSE-2024',
      stockLevel: 120,
      cost: 337500,
      value: 40500000,
      status: 'In Stock' as const,
    },
    {
      id: 'INV-003',
      productName: 'Stellar-Glide Keyboard',
      sku: 'SG-KBD-2024',
      stockLevel: 60,
      cost: 1200000,
      value: 72000000,
      status: 'In Stock' as const,
    },
    {
      id: 'INV-004',
      productName: 'Nova-Pixel Monitor',
      sku: 'NP-MON-2024',
      stockLevel: 35,
      cost: 5250000,
      value: 183750000,
      status: 'In Stock' as const,
    },
    {
        id: 'INV-005',
        productName: 'Cyber-Weave Cable',
        sku: 'CW-CBL-2024',
        stockLevel: 250,
        cost: 120000,
        value: 30000000,
        status: 'In Stock' as const,
      },
      {
        id: 'INV-006',
        productName: 'Placeholder Item',
        sku: 'PH-ITM-000',
        stockLevel: 0,
        cost: 100000,
        value: 0,
        status: 'Out of Stock' as const,
      },
  ];

export const usersData: (User & { managerId?: string, password?: string })[] = [
    {
        id: 'USER-001',
        name: 'Admin User',
        email: 'admin@notch.erp',
        role: 'Admin' as const,
        status: 'Active' as const,
        avatar: "https://placehold.co/100x100?text=AU",
        password: "password",
        division: "IT",
        jobPosition: "System Administrator",
        birthDate: new Date("1985-01-15"),
    },
    {
        id: 'USER-002',
        name: 'John Doe (Manager)',
        email: 'john.doe@notch.erp',
        role: 'Manager' as const,
        status: 'Active' as const,
        avatar: "https://placehold.co/100x100?text=JD",
        password: "password",
        managerId: 'USER-005',
        division: "Creative",
        jobPosition: "Creative Director",
        birthDate: new Date("1990-05-20"),
    },
    {
        id: 'USER-003',
        name: 'Jane Smith (Employee)',
        email: 'jane.smith@notch.erp',
        role: 'Employee' as const,
        status: 'Active' as const,
        managerId: 'USER-002',
        avatar: "https://placehold.co/100x100?text=JS",
        password: "password",
        division: "Creative",
        jobPosition: "UI/UX Designer",
        birthDate: new Date("1995-08-25"),
    },
     {
        id: 'USER-004',
        name: 'HR User',
        email: 'hr.user@notch.erp',
        role: 'HR' as const,
        status: 'Active' as const,
        avatar: "https://placehold.co/100x100?text=HR",
        password: "password",
        managerId: 'USER-005',
        division: "HR",
        jobPosition: "HR Manager",
        birthDate: new Date("1988-11-30"),
    },
    {
        id: 'USER-005',
        name: 'Director User',
        email: 'director@notch.erp',
        role: 'Director' as const,
        status: 'Active' as const,
        avatar: "https://placehold.co/100x100?text=DU",
        password: "password",
        division: "Director",
        jobPosition: "Director",
        birthDate: new Date("1975-02-10"),
    },
    {
        id: 'USER-006',
        name: 'Finance User',
        email: 'finance@notch.erp',
        role: 'Finance' as const,
        status: 'Active' as const,
        avatar: "https://placehold.co/100x100?text=FU",
        password: "password",
        division: "Finance",
        jobPosition: "Finance Controller",
        birthDate: new Date("1992-07-18"),
    }
];

export const leaveData: LeaveRequest[] = [
    {
      id: 'LEAVE-001',
      userId: "USER-003",
      startDate: new Date('2024-07-20'),
      endDate: new Date('2024-07-20'),
      type: 'Full Day' as const,
      status: 'Approved' as const,
      days: 1,
      reason: 'Doctor\'s Appointment',
    },
    {
      id: 'LEAVE-002',
      userId: "USER-002",
      startDate: new Date('2024-08-05'),
      endDate: new Date('2024-08-05'),
      type: 'Half Day' as const,
      status: 'Approved' as const,
      days: 0.5,
      reason: 'Personal Errand',
    },
    {
        id: 'LEAVE-003',
        userId: "USER-003",
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-02'),
        type: 'Full Day' as const,
        status: 'Pending Manager' as const,
        days: 2,
        reason: 'Family vacation',
    },
     {
      id: 'LEAVE-004',
      userId: "USER-002",
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-11'),
      type: 'Full Day' as const,
      status: 'Approved' as const,
      days: 2,
      reason: 'Vacation',
    },
    {
      id: 'LEAVE-005',
      userId: "USER-003",
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-15'),
      type: 'Full Day' as const,
      status: 'Approved' as const,
      days: 1,
      reason: 'Sick day',
    },
    {
      id: 'LEAVE-006',
      userId: 'USER-002',
      startDate: new Date('2024-08-19'),
      endDate: new Date('2024-08-21'),
      type: 'Full Day' as const,
      status: 'Approved' as const,
      days: 3,
      reason: 'Conference',
    },
    {
      id: 'LEAVE-007',
      userId: 'USER-005',
      startDate: new Date('2024-08-20'),
      endDate: new Date('2024-08-20'),
      type: 'Full Day' as const,
      status: 'Approved' as const,
      days: 1,
      reason: 'Offsite meeting',
    },
    {
        id: 'LEAVE-008',
        userId: "USER-003",
        startDate: new Date('2024-10-10'),
        endDate: new Date('2024-10-11'),
        type: 'Full Day' as const,
        status: 'Pending Manager' as const,
        days: 2,
        reason: 'Wedding',
    },
];

export const salaryData: SalaryData[] = [
    {
      id: "USER-001",
      name: "Admin User",
      role: "Admin",
      department: "Management",
      salary: 25000000,
      phone: "+62 812-3456-7890",
      bankName: "BCA",
      bankAccount: "1234567890",
    },
    {
      id: "USER-002",
      name: "John Doe (Manager)",
      role: "Manager",
      department: "Technology",
      salary: 20000000,
      phone: "+62 812-3456-7891",
      bankName: "Mandiri",
      bankAccount: "0987654321",
    },
    {
      id: "USER-003",
      name: "Jane Smith (Employee)",
      role: "Employee",
      department: "Design",
      salary: 12000000,
      phone: "+62 812-3456-7892",
      bankName: "BCA",
      bankAccount: "1122334455",
    },
     {
      id: "USER-004",
      name: "HR User",
      role: "HR",
      department: "Human Resources",
      salary: 18000000,
      phone: "+62 812-3456-7893",
      bankName: "BNI",
      bankAccount: "5566778899",
    },
    {
      id: "USER-005",
      name: "Director User",
      role: "Director",
      department: "Management",
      salary: 50000000,
      phone: "+62 812-3456-7894",
      bankName: "CIMB Niaga",
      bankAccount: "9988776655",
    },
    {
        id: "USER-006",
        name: "Finance User",
        role: "Finance",
        department: "Finance",
        salary: 22000000,
        phone: "+62 812-3456-7895",
        bankName: "BCA",
        bankAccount: "6677889900",
      },
  ];

  export const overtimeData: OvertimeRequest[] = [
    {
      id: 'OT-001',
      userId: 'USER-003',
      date: new Date('2024-07-22'),
      startTime: "18:00",
      endTime: "22:00",
      hours: 4,
      status: 'Paid' as const,
      reason: 'Urgent bug fix',
      type: 'Weekday' as const,
      compensatoryDayOff: null,
      allowances: ['Transport Allowance']
    },
    {
      id: 'OT-002',
      userId: 'USER-003',
      date: new Date('2024-08-11'), // A sunday
      startTime: "09:00",
      endTime: "17:00",
      hours: 8,
      status: 'Pending Manager' as const,
      reason: 'Project deadline push',
      type: 'Weekend' as const,
      compensatoryDayOff: new Date('2024-08-16'),
      allowances: [],
    },
];

export const attendanceData: Omit<AttendanceRecord, 'date'>[] = [
    {
        id: 'ATT-001',
        userId: 'USER-003',
        clockInTime: '2024-07-22T09:01:00.000Z',
        clockOutTime: '2024-07-22T17:05:00.000Z',
        duration: 28980,
        status: 'Attend on Weekdays',
        clockInLocationStatus: 'GPS In Range',
        clockOutLocationStatus: 'GPS In Range',
    },
    {
        id: 'ATT-002',
        userId: 'USER-003',
        clockInTime: '2024-07-23T08:55:00.000Z',
        clockOutTime: '2024-07-23T17:15:00.000Z',
        duration: 30000,
        status: 'Attend on Weekdays',
        clockInLocationStatus: 'GPS Out of Range',
        clockOutLocationStatus: 'GPS In Range',
    },
];

export const timesheetData = [
    {
        id: 'TS-001',
        userId: 'USER-003',
        date: new Date('2024-07-22'),
        projectName: 'NOTCH ERP System UI Development',
        hours: 8,
        status: 'Approved' as const,
        description: 'Worked on the dashboard and components.',
    },
    {
        id: 'TS-002',
        userId: 'USER-003',
        date: new Date('2024-07-23'),
        projectName: 'API Integration',
        hours: 6,
        status: 'Pending' as const,
        description: 'Integrated sales data endpoint.',
    },
];

export const reimbursementData: ReimbursementRequest[] = [
    {
        id: 'REIM-001',
        userId: 'USER-003',
        date: new Date('2024-07-15'),
        item: 'Team Lunch',
        amount: 2261250,
        status: 'Paid' as const,
        description: 'Client meeting lunch',
        joNumber: 'PROJ-ALPHA-TASK1',
        attachmentUrl: 'https://placehold.co/200x100?text=Receipt1'
    },
    {
        id: 'REIM-002',
        userId: 'USER-002',
        date: new Date('2024-07-20'),
        item: 'Software Subscription',
        amount: 749850,
        status: 'Pending Manager' as const,
        description: 'New design software license',
        joNumber: null,
        attachmentUrl: null
    },
    {
        id: 'REIM-003',
        userId: 'USER-003',
        date: new Date('2024-07-21'),
        item: 'Office Supplies',
        amount: 1282500,
        status: 'Rejected' as const,
        description: 'Not a pre-approved expense',
        joNumber: null,
        attachmentUrl: 'https://placehold.co/200x100?text=Receipt2'
    }
];

export const medicalData: MedicalRequest[] = [
    {
        id: 'MED-001',
        userId: 'USER-003',
        date: new Date('2024-07-10'),
        type: 'General Medical',
        amount: 1125000,
        status: 'Approved' as const,
        receiptUrl: 'https://placehold.co/200x100?text=Receipt1',
    },
    {
        id: 'MED-002',
        userId: 'USER-003',
        date: new Date('2024-07-18'),
        type: 'Vitamins',
        amount: 682500,
        status: 'Pending Manager' as const,
        receiptUrl: null,
    },
    {
        id: 'MED-003',
        userId: 'USER-003',
        date: new Date('2024-04-05'),
        type: 'Optical',
        amount: 500000,
        status: 'Approved' as const,
        receiptUrl: null,
    }
];

export const monthlyLeaveData = leaveData
  .filter(d => d.status === 'Approved')
  .reduce((acc, leave) => {
    const month = format(leave.startDate, 'MMM');
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.days += leave.days;
    } else {
      acc.push({ name: month, days: leave.days });
    }
    return acc;
  }, [] as { name: string; days: number }[]);

export const jobOrdersData: JobOrder[] = [
  {
    id: "JO-001",
    code: "PROJ-ALPHA-TASK1",
    projectName: "Project Alpha",
    taskName: "Initial Setup",
    status: "Active",
    createdAt: new Date("2024-07-01"),
  },
  {
    id: "JO-002",
    code: "PROJ-BETA-TASK2",
    projectName: "Project Beta",
    taskName: "Development",
    status: "Active",
    createdAt: new Date("2024-07-05"),
  },
  {
    id: "JO-003",
    code: "PROJ-GAMMA-TASK3",
    projectName: "Project Gamma",
    taskName: "Deployment",
    status: "Inactive",
    createdAt: new Date("2024-06-15"),
  },
];

export const divisionsData: Division[] = [
    { id: "DIV-001", name: "IT", createdAt: new Date("2024-01-01") },
    { id: "DIV-002", name: "Media", createdAt: new Date("2024-01-01") },
    { id: "DIV-003", name: "Account Executive", createdAt: new Date("2024-01-01") },
    { id: "DIV-004", name: "Content", createdAt: new Date("2024-01-01") },
    { id: "DIV-005", name: "Creative", createdAt: new Date("2024-01-01") },
    { id: "DIV-006", name: "HR", createdAt: new Date("2024-01-01") },
    { id: "DIV-007", name: "Finance", createdAt: new Date("2024-01-01") },
    { id: "DIV-008", name: "Community", createdAt: new Date("2024-01-01") },
    { id: "DIV-009", name: "Data Analyst", createdAt: new Date("2024-01-01") },
    { id: "DIV-010", name: "Director", createdAt: new Date("2024-01-01") },
];

export const locationsData: Location[] = [
    {
      id: "LOC-001",
      name: "Main Office",
      address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan, DKI Jakarta, Indonesia 12190",
      latitude: -6.224,
      longitude: 106.809,
      rangeInMeters: 50,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "LOC-002",
      name: "Warehouse",
      address: "Jl. Raya Bekasi Km. 21, Cakung, Jakarta Timur, DKI Jakarta, Indonesia 13910",
      latitude: -6.211,
      longitude: 106.942,
      rangeInMeters: 100,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-05-20"),
    },
];

export const overtimeTypesData: OvertimeType[] = [
    { 
        id: "OT-TYPE-001",
        name: "Weekday",
        allowances: ["Transport Allowance", "Meal Allowance"],
        createdAt: new Date("2024-01-01"),
    },
    { 
        id: "OT-TYPE-002", 
        name: "Weekend", 
        allowances: [],
        createdAt: new Date("2024-01-01"),
    },
];


const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
allMonths.forEach(month => {
    if(!monthlyLeaveData.find(d => d.name === month)) {
        monthlyLeaveData.push({name: month, days: 0});
    }
});
monthlyLeaveData.sort((a,b) => allMonths.indexOf(a.name) - allMonths.indexOf(b.name));
