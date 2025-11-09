'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Camera, UserCheck, Clock, CheckCircle, XCircle, UserPlus, X } from 'lucide-react';
import { attendanceData, usersData } from '@/lib/mock-data';
import { ResponsiveTabs, ResponsiveTabsContent } from '@/components/ui/responsive-tabs';
import Pagination from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  employee: string;
  employeeId: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  verified: boolean;
  checkInPhoto?: string;
  checkOutPhoto?: string;
}

export default function AttendancePage() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('today');
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isClockDialogOpen, setIsClockDialogOpen] = useState(false);
  const [clockType, setClockType] = useState<'in' | 'out'>('in');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollEmployeeId, setEnrollEmployeeId] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const itemsPerPage = 5;

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return attendanceData.map((record) => {
      const user = usersData.find((u) => u.id === record.userId);
      const checkInTime = new Date(record.clockInTime as string);
      const checkOutTime = record.clockOutTime ? new Date(record.clockOutTime as string) : null;
      
      return {
        id: record.id,
        employee: user?.name || 'Unknown',
        employeeId: record.userId,
        checkIn: checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        checkOut: checkOutTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) || null,
        status: record.status.toLowerCase().includes('attend') ? 'present' : 'absent',
        verified: record.clockInLocationStatus === 'GPS In Range',
      };
    });
  });

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    let filtered = attendanceRecords;

    // Filter by tab
    if (activeTab === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter((record) => {
        // For demo, show all records as "today"
        return true;
      });
    }
    // 'all' tab shows all records

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((record) =>
        record.employee.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [attendanceRecords, searchQuery, activeTab]);

  // Paginate filtered records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecords.slice(startIndex, endIndex);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Camera functions
  const startCamera = async () => {
    try {
      // Stop any existing stream first
      stopCamera();
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      setHasStream(true); // Trigger re-render to show video element
      
      // Wait for next render cycle to ensure video element exists
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        
        // Set up event handler for when video starts playing
        const handlePlaying = () => {
          setIsCameraActive(true);
        };
        
        video.addEventListener('playing', handlePlaying, { once: true });
        
        // Also listen for loadedmetadata as backup
        const handleLoadedMetadata = () => {
          video.play().catch((err) => {
            console.error('Play error after metadata:', err);
          });
        };
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        
        // Try to play immediately
        try {
          await video.play();
        } catch (playError) {
          console.error('Initial play error:', playError);
          // Video will play when metadata loads via the event handler
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      setIsCameraActive(false);
      stopCamera();
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Failed to access camera. Please check permissions.',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      const video = videoRef.current;
      video.pause();
      video.srcObject = null;
      // Remove event listeners
      video.onloadedmetadata = null;
      const playingHandler = () => setIsCameraActive(true);
      video.removeEventListener('playing', playingHandler);
    }
    setIsCameraActive(false);
    setHasStream(false); // Trigger re-render to hide video element
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Flip the image back to normal (since we mirrored it in the preview)
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/png');
        setCapturedPhoto(photoData);
        // Stop camera after capturing
        stopCamera();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Camera not ready. Please wait a moment and try again.',
        });
      }
    }
  };

  const handleCancelCamera = () => {
    stopCamera();
    setCapturedPhoto(null);
  };

  const handleOpenEnrollDialog = () => {
    setIsEnrollDialogOpen(true);
    setEnrollEmployeeId('');
  };

  const handleCloseEnrollDialog = () => {
    stopCamera();
    setIsEnrollDialogOpen(false);
    setEnrollEmployeeId('');
    setCapturedPhoto(null);
  };

  const handleEnrollSubmit = async () => {
    if (!enrollEmployeeId) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select an employee.',
      });
      return;
    }

    if (!capturedPhoto) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please capture a photo for enrollment.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: 'Success',
        description: 'Employee enrolled successfully for face recognition.',
      });
      handleCloseEnrollDialog();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to enroll employee. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenClockDialog = (type: 'in' | 'out', employeeId?: string) => {
    setClockType(type);
    setSelectedEmployee(employeeId || '');
    setCapturedPhoto(null);
    setIsClockDialogOpen(true);
  };

  const handleCloseClockDialog = () => {
    stopCamera();
    setIsClockDialogOpen(false);
    setSelectedEmployee('');
    setCapturedPhoto(null);
  };

  const handleClockSubmit = async () => {
    if (!selectedEmployee) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select an employee.',
      });
      return;
    }

    if (!capturedPhoto) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please capture a photo for verification.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const user = usersData.find((u) => u.id === selectedEmployee);

      if (clockType === 'in') {
        const newRecord: AttendanceRecord = {
          id: `ATT-${Date.now()}`,
          employee: user?.name || 'Unknown',
          employeeId: selectedEmployee,
          checkIn: timeString,
          checkOut: null,
          status: 'present',
          verified: true,
          checkInPhoto: capturedPhoto,
        };
        setAttendanceRecords((prev) => [newRecord, ...prev]);
        toast({
          title: 'Success',
          description: `Clock in recorded for ${user?.name || 'employee'}.`,
        });
      } else {
        setAttendanceRecords((prev) =>
          prev.map((record) =>
            record.employeeId === selectedEmployee && !record.checkOut
              ? {
                  ...record,
                  checkOut: timeString,
                  checkOutPhoto: capturedPhoto,
                }
              : record
          )
        );
        toast({
          title: 'Success',
          description: `Clock out recorded for ${user?.name || 'employee'}.`,
        });
      }

      handleCloseClockDialog();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record attendance. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup camera when dialogs close
  useEffect(() => {
    if (!isEnrollDialogOpen && !isClockDialogOpen) {
      stopCamera();
    }
  }, [isEnrollDialogOpen, isClockDialogOpen]);

  // Ensure video plays when stream is set and video element exists
  useEffect(() => {
    if (hasStream && streamRef.current && videoRef.current && !isCameraActive) {
      const video = videoRef.current;
      if (!video.srcObject && streamRef.current) {
        video.srcObject = streamRef.current;
      }
      
      const handlePlaying = () => {
        setIsCameraActive(true);
      };
      
      video.addEventListener('playing', handlePlaying, { once: true });
      
      // Try to play
      video.play().catch((err) => {
        console.error('Play error in useEffect:', err);
      });
      
      return () => {
        video.removeEventListener('playing', handlePlaying);
      };
    }
  }, [hasStream, isCameraActive]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className="bg-green-500 text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Present
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="mr-1 h-3 w-3" />
            Absent
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
            <Clock className="mr-1 h-3 w-3" />
            Late
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const renderAttendanceList = () => {
    if (paginatedRecords.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? 'No attendance records found matching your search'
              : 'No attendance records found'}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3 sm:space-y-4">
          {paginatedRecords.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 sm:p-5 hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Header: Name and Status */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">{record.employee}</h3>
                    {getStatusBadge(record.status)}
                    {record.verified && (
                      <Badge variant="outline" className="border-green-500 text-xs">
                        <Camera className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  {/* Time Info - Stacked on mobile */}
                  <div className="space-y-1.5 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>Check-in: <span className="font-medium text-foreground">{record.checkIn}</span></span>
                    </div>
                    {record.checkOut && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Check-out: <span className="font-medium text-foreground">{record.checkOut}</span></span>
                      </div>
                    )}
                  </div>
                  
                  {/* Photo Preview if available */}
                  {(record.checkInPhoto || record.checkOutPhoto) && (
                    <div className="mb-3 flex gap-2">
                      {record.checkInPhoto && (
                        <div className="relative">
                          <img
                            src={record.checkInPhoto}
                            alt="Check-in photo"
                            className="h-16 w-16 rounded border object-cover"
                          />
                          <span className="absolute -bottom-1 left-0 right-0 text-[8px] text-center bg-primary text-primary-foreground rounded">
                            In
                          </span>
                        </div>
                      )}
                      {record.checkOutPhoto && (
                        <div className="relative">
                          <img
                            src={record.checkOutPhoto}
                            alt="Check-out photo"
                            className="h-16 w-16 rounded border object-cover"
                          />
                          <span className="absolute -bottom-1 left-0 right-0 text-[8px] text-center bg-primary text-primary-foreground rounded">
                            Out
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action Buttons - Full width on mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    {!record.checkIn && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenClockDialog('in', record.employeeId)}
                        className="w-full sm:w-auto text-sm"
                      >
                        <Camera className="mr-2 h-3 w-3" />
                        Clock In
                      </Button>
                    )}
                    {record.checkIn && !record.checkOut && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenClockDialog('out', record.employeeId)}
                        className="w-full sm:w-auto text-sm"
                      >
                        <Camera className="mr-2 h-3 w-3" />
                        Clock Out
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="mt-4 sm:mt-6">
            <Pagination
              meta={{
                total: filteredRecords.length,
                limit: itemsPerPage,
                page: currentPage,
              }}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Attendance Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage employee attendance with face recognition</p>
        </div>
        <Button onClick={handleOpenEnrollDialog} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Enroll Employee
        </Button>
      </div>

      <ResponsiveTabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
        }}
        items={[
          { value: 'today', label: 'Today' },
          { value: 'all', label: 'All Records' },
        ]}
        mobileMode={isMobile ? 'select' : 'scroll'}
        className="space-y-4"
      >
        <ResponsiveTabsContent value="today">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Today&apos;s Attendance</CardTitle>
                  <CardDescription>
                    {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderAttendanceList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>

        <ResponsiveTabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>All Attendance Records</CardTitle>
                  <CardDescription>
                    {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderAttendanceList()}</CardContent>
          </Card>
        </ResponsiveTabsContent>
      </ResponsiveTabs>

      {/* Enroll Employee Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enroll Employee for Face Recognition</DialogTitle>
            <DialogDescription>
              Select an employee and capture their photo for attendance verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="enrollEmployee">Select Employee *</Label>
              <Select value={enrollEmployeeId} onValueChange={setEnrollEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {usersData.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Capture Photo *</Label>
              {!capturedPhoto ? (
                <div className="border-2 border-dashed rounded-lg p-4">
                  {!hasStream ? (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Click &quot;Start Camera&quot; to capture employee photo
                      </p>
                      <Button onClick={startCamera} variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden aspect-video min-h-[200px]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        {!isCameraActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-white text-sm">Starting camera...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={capturePhoto} 
                          className="flex-1" 
                          disabled={!isCameraActive}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button 
                          onClick={handleCancelCamera} 
                          variant="outline" 
                          className="flex-1 sm:flex-initial"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative border rounded-lg overflow-hidden bg-black">
                    <img
                      src={capturedPhoto}
                      alt="Captured photo"
                      className="w-full h-auto max-h-96 mx-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Retake Photo
                    </Button>
                    <Button
                      onClick={handleCancelCamera}
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseEnrollDialog} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleEnrollSubmit} disabled={isSubmitting || !capturedPhoto || !enrollEmployeeId} className="w-full sm:w-auto">
              {isSubmitting ? 'Enrolling...' : 'Enroll Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clock In/Out Dialog */}
      <Dialog open={isClockDialogOpen} onOpenChange={setIsClockDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Clock {clockType === 'in' ? 'In' : 'Out'}</DialogTitle>
            <DialogDescription>
              Capture your photo to verify {clockType === 'in' ? 'clock in' : 'clock out'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clockEmployee">Select Employee *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {usersData.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Capture Photo *</Label>
              {!capturedPhoto ? (
                <div className="border-2 border-dashed rounded-lg p-4">
                  {!hasStream ? (
                    <div className="text-center py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Click &quot;Start Camera&quot; to capture your photo
                      </p>
                      <Button onClick={startCamera} variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden aspect-video min-h-[200px]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        {!isCameraActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-white text-sm">Starting camera...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={capturePhoto} 
                          className="flex-1" 
                          disabled={!isCameraActive}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button 
                          onClick={handleCancelCamera} 
                          variant="outline" 
                          className="flex-1 sm:flex-initial"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative border rounded-lg overflow-hidden bg-black">
                    <img
                      src={capturedPhoto}
                      alt="Captured photo"
                      className="w-full h-auto max-h-96 mx-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Retake Photo
                    </Button>
                    <Button
                      onClick={handleCancelCamera}
                      variant="outline"
                      className="flex-1 sm:flex-initial"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCloseClockDialog} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={handleClockSubmit}
              disabled={isSubmitting || !capturedPhoto || !selectedEmployee}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Processing...' : `Clock ${clockType === 'in' ? 'In' : 'Out'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
