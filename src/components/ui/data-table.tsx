"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format, isSameDay, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterType?: "text" | "date"
  renderRowAsCard?: (row: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn = "name",
  filterType = "text",
  renderRowAsCard,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [date, setDate] = React.useState<Date | undefined>()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
        sorting,
        columnFilters,
        },
    })

    React.useEffect(() => {
        if (filterType === 'date' && filterColumn) {
            if (date) {
                 table.getColumn(filterColumn)?.setFilterValue((value: string) => {
                    if (!value) return false;
                    try {
                        return isSameDay(parseISO(value), date);
                    } catch (e) {
                        return false;
                    }
                });
            } else {
                table.getColumn(filterColumn)?.setFilterValue(undefined);
            }
        }
    }, [date, table, filterType, filterColumn]);

    const handleTextFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        table.getColumn(filterColumn)?.setFilterValue(event.target.value)
    }

  return (
    <div>
        <div className="flex items-center py-4">
            {filterType === 'date' ? (
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full md:w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Filter by date...</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                    />
                    </PopoverContent>
                </Popover>
            ) : (
                 <Input
                    placeholder={`Filter by ${filterColumn}...`}
                    value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                    onChange={handleTextFilterChange}
                    className="max-w-sm"
                />
            )}
           
        </div>
        <div className="rounded-md border md:hidden">
             {table.getRowModel().rows?.length ? (
                <div className="space-y-2 p-2">
                    {table.getRowModel().rows.map((row) => (
                        <div key={row.id}>
                           {renderRowAsCard ? renderRowAsCard(row.original) : <div>Please define a renderRowAsCard function.</div>}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-24 text-center flex items-center justify-center">
                    No results.
                </div>
            )}
        </div>
        <div className="rounded-md border hidden md:block">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
  )
}
