"use client"

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, MoreHorizontal, Check, X, Clock, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ApplicationModal } from "@/components/application-modal"
import { useApplications } from "@/hooks/use-applications"
import type { Application, TableState } from "@/types/application"

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
  },
  accepted: {
    label: "Accepted",
    variant: "default" as const,
    icon: Check,
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: X,
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
  },
  waitlisted: {
    label: "Waitlisted",
    variant: "outline" as const,
    icon: UserCheck,
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  },
}

export function ApplicationsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extract drive_id from URL
  const driveId = searchParams.get("drive_id") || undefined
  const applicationId = searchParams.get("application_id")

  const [tableState, setTableState] = useState<TableState>({
    pageIndex: 0,
    pageSize: 10,
    sorting: [],
    globalFilter: "",
    driveId,
  })

  // Update tableState when driveId changes
  useEffect(() => {
    setTableState((prev) => ({ ...prev, driveId }))
  }, [driveId])

  const { data, loading, error, updateApplicationStatus } = useApplications(tableState)

  // Modal state - separate from data fetching
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle URL parameter for application ID
  useEffect(() => {
    if (applicationId && data.length > 0 && !isModalOpen) {
      const applicant = data.find((app) => app.id === applicationId)
      if (applicant) {
        setSelectedApplicant(applicant)
        setIsModalOpen(true)
      }
    } else if (!applicationId && isModalOpen) {
      // URL was changed externally, close modal
      setIsModalOpen(false)
      setSelectedApplicant(null)
    }
  }, [applicationId, data, isModalOpen])

  const handleRowClick = (application: Application) => {
    setSelectedApplicant(application)
    setIsModalOpen(true)

    // Update URL with application ID, preserve drive_id
    const params = new URLSearchParams(searchParams.toString())
    params.set("application_id", application.id)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setIsModalOpen(false)
      setSelectedApplicant(null)

      // Remove application_id from URL immediately
      const params = new URLSearchParams(searchParams.toString())
      params.delete("application_id")
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
      router.replace(newUrl, { scroll: false })
    } else {
      setIsModalOpen(true)
    }
  }

  const handleStatusUpdateFromModal = (id: string, newStatus: "pending" | "accepted" | "rejected" | "waitlisted") => {
    // Update the table data when status is changed from modal
    updateApplicationStatus(id, newStatus)

    // Update the selected applicant state
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus })
    }
  }

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            First Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last Name
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
      accessorKey: "portfolio",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Portfolio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const portfolio = row.getValue("portfolio") as string
        const portfolioColors = {
          Marketing: "bg-purple-100 text-purple-800 border-purple-200",
          Digital: "bg-cyan-100 text-cyan-800 border-cyan-200",
          Design: "bg-pink-100 text-pink-800 border-pink-200",
          Engineering: "bg-orange-100 text-orange-800 border-orange-200",
        }
        const colorClass =
          portfolioColors[portfolio as keyof typeof portfolioColors] || "bg-gray-100 text-gray-800 border-gray-200"

        return <Badge className={colorClass}>{portfolio}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          variant: "secondary" as const,
          icon: Clock,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        }
        const Icon = config.icon

        return (
          <Badge className={`${config.color} flex items-center gap-1 w-fit`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const application = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {application.status !== "accepted" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    updateApplicationStatus(application.id, "accepted")
                  }}
                  className="text-green-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
              )}
              {application.status !== "waitlisted" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    updateApplicationStatus(application.id, "waitlisted")
                  }}
                  className="text-blue-600"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Waitlist
                </DropdownMenuItem>
              )}
              {application.status !== "rejected" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    updateApplicationStatus(application.id, "rejected")
                  }}
                  className="text-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              )}
              {application.status !== "pending" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    updateApplicationStatus(application.id, "pending")
                  }}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Set Pending
                </DropdownMenuItem>
              )}
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
    manualSorting: false,
    manualPagination: false,
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <p>Error loading applications: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search applications..."
            value={tableState.globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          {driveId && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Drive: {driveId}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{loading ? "Loading..." : `${data.length} applications`}</div>
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
                <TableRow
                  key={row.original.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? "Loading..." : "No applications found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

      <ApplicationModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onStatusUpdate={handleStatusUpdateFromModal}
      />
    </div>
  )
}
