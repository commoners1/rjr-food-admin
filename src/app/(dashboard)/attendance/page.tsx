'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Camera, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { attendanceData, usersData } from '@/lib/mock-data';

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Transform attendance data for display
  const attendanceRecords = attendanceData.map((record) => {
    const user = usersData.find((u) => u.id === record.userId);
    const checkInTime = new Date(record.clockInTime);
    const checkOutTime = record.clockOutTime ? new Date(record.clockOutTime) : null;
    
    return {
      id: record.id,
      employee: user?.name || 'Unknown',
      checkIn: checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      checkOut: checkOutTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || null,
      status: record.status.toLowerCase().includes('attend') ? 'present' : 'absent',
      verified: record.clockInLocationStatus === 'GPS In Range',
    };
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Late
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Manage employee attendance with face recognition</p>
        </div>
        <Button>
          <Camera className="mr-2 h-4 w-4" />
          Enroll Employee
        </Button>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="enrollment">Face Enrollment</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today&apos;s Attendance</CardTitle>
                  <CardDescription>Real-time attendance tracking</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.employee}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Check-in: {record.checkIn}</span>
                          {record.checkOut && <span>Check-out: {record.checkOut}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      {record.verified && (
                        <Badge variant="outline" className="border-green-500">
                          <Camera className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Attendance Records</CardTitle>
              <CardDescription>Historical attendance data</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[]}
                data={attendanceRecords}
                filterColumn="employee"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment">
          <Card>
            <CardHeader>
              <CardTitle>Face Enrollment</CardTitle>
              <CardDescription>Enroll employees for face recognition attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Enroll New Employee</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Capture face images for attendance verification
                </p>
                <Button>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Enrollment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
