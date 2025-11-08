import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
  const isPositive = change ? change.startsWith("+") : true;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        {change && (
            <p className="text-xs text-muted-foreground flex items-center">
            {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
            )}
            {change}
            </p>
        )}
      </CardContent>
    </Card>
  );
}
