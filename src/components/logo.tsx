import { BarChart3 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 py-4">
      <BarChart3 className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold font-headline">RJR Admin</h1>
    </div>
  );
}
