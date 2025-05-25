"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Application, ApplicationsResponse, TableState } from "@/types/application"

export function useApplications(tableState: TableState) {
  const [data, setData] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const updateApplicationStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      console.log(newStatus)
      // Replace with your actual API endpoint for updating status
      const response = await fetch("http://localhost:3000/dashboard/protected/applications/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for authentication
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application status")
      }

      // Update the local data instead of refetching
      setData((prevData) => prevData.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))

      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Update failed" }
    }
  }, [driveId])

  return {
    data,
    loading,
    error,
    refetch: fetchApplications,
    updateApplicationStatus,
  }
}
