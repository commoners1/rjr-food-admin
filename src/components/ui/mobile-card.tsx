
import * as React from "react"
import { cn } from "@/lib/utils"

const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
MobileCard.displayName = "MobileCard"

const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 border-b", className)}
    {...props}
  />
))
MobileCardHeader.displayName = "MobileCardHeader"

const MobileCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
MobileCardTitle.displayName = "MobileCardTitle"


const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 space-y-2", className)} {...props} />
))
MobileCardContent.displayName = "MobileCardContent"

interface MobileCardRowProps {
    label: string;
    value: React.ReactNode;
}

const MobileCardRow = ({ label, value }: MobileCardRowProps) => (
    <div className="flex justify-between items-center text-sm">
        <div className="text-muted-foreground">{label}</div>
        <div className="text-right font-medium">{value}</div>
    </div>
)

export { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardContent, MobileCardRow }
