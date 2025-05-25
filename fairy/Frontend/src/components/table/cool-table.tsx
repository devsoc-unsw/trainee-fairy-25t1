"use client"

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useUsers, type TableState } from "@/hooks/use-users"
import type { User } from "@/lib/supabase"

export function UsersTable() {
  const [tableState, setTableState] = useState<TableState>({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    globalFilter: "",
  })

  const { data, loading, totalCount, deleteUser, updateUser } = useUsers(tableState)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  updateUser(user.id, {
                    status: user.status === "active" ? "inactive" : "active",
                  })
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Toggle Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteUser(user.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / tableState.pageSize),
    state: {
      sorting: tableState.sorting,
      pagination: {
        pageIndex: tableState.pageIndex,
        pageSize: tableState.pageSize,
      },
      globalFilter: tableState.globalFilter,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(tableState.sorting) : updater
      setTableState((prev) => ({ ...prev, sorting: newSorting }))
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex: tableState.pageIndex, pageSize: tableState.pageSize })
          : updater
      setTableState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }))
    },
    onGlobalFilterChange: (value) => {
      setTableState((prev) => ({ ...prev, globalFilter: value, pageIndex: 0 }))
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={tableState.globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">{loading ? "Loading..." : `${totalCount} total users`}</div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {tableState.pageIndex + 1} of {Math.ceil(totalCount / tableState.pageSize)}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
