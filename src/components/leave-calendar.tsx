
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import { eachDayOfInterval, format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface LeaveCalendarProps {
  leaveData: LeaveRequest[];
  userData: User[];
  title?: string;
}

const colorPalette = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function LeaveCalendar({ leaveData, userData, title = "Leave Calendar" }: LeaveCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const userColorMap = useMemo(() => {
    const map = new Map<string, { color: string; modifier: string }>();
    userData.forEach((user, index) => {
      map.set(user.id, {
        color: colorPalette[index % colorPalette.length],
        modifier: `user-${user.id.replace(/\W/g, '_')}` // Create a CSS-safe modifier
      });
    });
    return map;
  }, [userData]);
  
  const modifiers = useMemo(() => {
    const mods: Record<string, Date[]> = {};
    leaveData.forEach(request => {
      const userMap = userColorMap.get(request.userId);
      if (userMap) {
        const { modifier } = userMap;
        const days = eachDayOfInterval({ start: request.startDate, end: request.endDate });
        if (!mods[modifier]) {
          mods[modifier] = [];
        }
        mods[modifier].push(...days);
      }
    });
    return mods;
  }, [leaveData, userColorMap]);

  const modifierStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    userData.forEach((user) => {
      const userMap = userColorMap.get(user.id);
      if (userMap) {
        styles[userMap.modifier] = { 
          backgroundColor: userMap.color,
          color: 'hsl(var(--primary-foreground))'
        };
      }
    });
    return styles;
  }, [userData, userColorMap]);
  
  const onLeaveForSelectedDate = date ? leaveData.filter(request => 
    date >= request.startDate && date <= request.endDate
  ) : [];
  
  const footer = (
    <div className="mt-4 text-sm px-4 pb-4 min-h-[100px]">
      <Separator className="mb-4" />
        <h4 className="font-semibold mb-2">On Leave ({date ? format(date, 'PPP') : 'N/A'})</h4>
        {onLeaveForSelectedDate.length > 0 ? (
            <ul className="space-y-2">
                {onLeaveForSelectedDate.map(request => {
                     const user = userData.find(u => u.id === request.userId);
                     const userMap = userColorMap.get(request.userId);
                     return (
                        <li key={request.id} className="flex items-center gap-2">
                            {userMap && <span className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: userMap.color }}></span>}
                            <div>
                                <span className="font-medium text-xs">{user?.name || 'Unknown'}</span>:
                                <span className="text-muted-foreground text-xs ml-1">{request.reason}</span>
                            </div>
                        </li>
                     )
                })}
            </ul>
        ) : (
            <p className="text-muted-foreground text-xs">No employees on leave on this day.</p>
        )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>An overview of approved leave days. Click a date to see details.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          modifiers={modifiers}
          modifiersStyles={modifierStyles}
          footer={footer}
          classNames={{
            head_cell: "w-10 h-10 font-normal text-sm flex items-center justify-center",
            cell: "h-10 w-10 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100",
            day_selected: "h-10 w-10 rounded-md bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          }}
        />
      </CardContent>
    </Card>
  );
}
