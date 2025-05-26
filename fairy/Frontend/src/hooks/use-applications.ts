"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Application, ApplicationsResponse, TableState } from "@/types/application"
import { toast } from "sonner"

import { useApplicationContext } from "@/contexts/application-context"

export function useApplications(tableState: TableState) {
  const [data, setData] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { triggerStatusUpdate } = useApplicationContext()

  // Extract individual values to avoid object reference issues
  const { globalFilter, sorting, driveId } = tableState

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:3000/dashboard/protected/applications/${driveId}?drive_id=${driveId}`, // Ensure driveId is included in the URL
        {
          credentials: "include", // Include credentials for authentication
        },
      )
      console.log(response)
      if (response.status === 403) {
        throw new Error("Forbidden: You do not have access to this drive")
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch applications for drive ${driveId}`)
      }

      const result: ApplicationsResponse = await response.json()
      let applications = result.applications || []

      // Client-side filtering (you can move this to server-side if needed)
      if (globalFilter) {
        const filter = globalFilter.toLowerCase()
        applications = applications.filter(
          (app) =>
            app.first_name.toLowerCase().includes(filter) ||
            app.last_name.toLowerCase().includes(filter) ||
            app.email.toLowerCase().includes(filter) ||
            app.portfolio.toLowerCase().includes(filter) ||
            app.status.toLowerCase().includes(filter),
        )
      }

      // Client-side sorting (you can move this to server-side if needed)
      if (sorting.length > 0) {
        const sort = sorting[0]
        applications.sort((a, b) => {
          const aValue = a[sort.id as keyof Application]
          const bValue = b[sort.id as keyof Application]

          if (aValue < bValue) return sort.desc ? 1 : -1
          if (aValue > bValue) return sort.desc ? -1 : 1
          return 0
        })
      }

      setData(applications)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [globalFilter, sorting, driveId]) // Only depend on filter and sorting, not URL params

  // Use useMemo to memoize the sorting dependency
  const sortingKey = useMemo(() => {
    return sorting.map((s) => `${s.id}-${s.desc}`).join(",")
  }, [sorting])

  // Only fetch on initial load and when filter/sort changes
  useEffect(() => {
    fetchApplications()
  }, [fetchApplications, sortingKey, globalFilter, driveId])

  const updateApplicationStatus = useCallback(
    async (id: string, newStatus: string) => {
      const statusMessages = {
        accepted: {
          loading: "Accepting application...",
          success: "Successfully accepted.",
          description: "You have accepted this application.",
        },
        rejected: {
          loading: "Rejecting application...",
          success: "Successfully rejected.",
          description: "You have rejected this application.",
        },
        waitlisted: {
          loading: "Adding to waitlist...",
          success: "Successfully waitlisted.",
          description: "You have waitlisted this application.",
        },
        pending: {
          loading: "Updating status...",
          success: "Status updated to pending.",
          description: "You have set this application to pending.",
        },
      }

      const message = statusMessages[newStatus as keyof typeof statusMessages] || {
        loading: "Updating application status...",
        success: "Application status updated successfully.",
        description: `You have updated this application to ${newStatus}.`,
      }

      const updatePromise = async () => {
        const response = await fetch("http://localhost:3000/dashboard/protected/applications/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id, status: newStatus }),
        })

        if (!response.ok) {
          throw new Error("Failed to update application status")
        }

        // Update the local data instead of refetching
        setData((prevData) =>
          prevData.map((app) =>
            app.id === id ? { ...app, status: newStatus as "pending" | "accepted" | "rejected" | "waitlisted" } : app,
          ),
        )
        // Trigger status update for other components
        triggerStatusUpdate()

        return { success: true }
      }

      // Use Sonner promise toast
      toast.promise(updatePromise(), {
        loading: message.loading,
        success: () => ({
          title: message.success,
          description: message.description,
        }),
        error: (error) => ({
          title: "Failed to update status",
          description: error.message || "An unexpected error occurred.",
        }),
      })

      try {
        await updatePromise()
        return { success: true }
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Update failed" }
      }
    },
    [driveId, triggerStatusUpdate],
  )
      

  return {
    data,
    loading,
    error,
    refetch: fetchApplications,
    updateApplicationStatus,
  }
}
