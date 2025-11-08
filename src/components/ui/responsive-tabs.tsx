"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
}

interface ResponsiveTabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  items: TabItem[]
  children: React.ReactNode
  className?: string
  mobileMode?: 'select' | 'scroll' // 'select' = dropdown, 'scroll' = horizontal scroll
}

const ResponsiveTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  ResponsiveTabsProps
>(({ 
  defaultValue, 
  value, 
  onValueChange, 
  items, 
  children, 
  className,
  mobileMode = 'select' // Default to dropdown on mobile
}, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || items[0]?.value)

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={selectedValue}
      onValueChange={handleValueChange}
      defaultValue={defaultValue}
      className={cn("space-y-4", className)}
    >
      {/* Mobile: Dropdown Select */}
      {mobileMode === 'select' && (
        <div className="block sm:hidden">
          <Select value={selectedValue} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {items.find(item => item.value === selectedValue)?.label || 'Select...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Mobile: Horizontal Scroll OR Desktop: Normal Tabs */}
      <div className={cn(
        mobileMode === 'scroll' ? "block" : "hidden",
        "sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      )}>
        <TabsPrimitive.List className="inline-flex w-max min-w-full sm:min-w-0 sm:w-auto h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          {items.map((item) => (
            <TabsPrimitive.Trigger
              key={item.value}
              value={item.value}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 sm:px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-shrink-0"
              )}
            >
              {item.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </div>

      {children}
    </TabsPrimitive.Root>
  )
})

ResponsiveTabs.displayName = "ResponsiveTabs"

// Re-export TabsContent for convenience
const ResponsiveTabsContent = TabsPrimitive.Content

export { ResponsiveTabs, ResponsiveTabsContent, type TabItem }

