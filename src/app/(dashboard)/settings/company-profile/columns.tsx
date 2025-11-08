
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Company } from "./mock-data";


export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
]
