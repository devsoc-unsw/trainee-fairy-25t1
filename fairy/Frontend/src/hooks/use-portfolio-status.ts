"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useApplicationContext } from "@/contexts/application-context"
import type { PortfolioStatus } from "@/types/portfolio-status"

export function usePortfolioStatus() {
  const [data, setData] = useState<PortfolioStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const driveId = searchParams.get("drive_id")
  const { statusUpdateTrigger } = useApplicationContext()

  const fetchPortfolioStatus = useCallback(async () => {
    if (!driveId) {
      setData([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/application/status/${driveId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio status data")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch portfolio status data"
      setError(errorMessage)
      toast.error("Failed to load status data", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }, [driveId])

  useEffect(() => {
    fetchPortfolioStatus()
  }, [driveId, statusUpdateTrigger]) // Also refetch when status updates

  return {
    data,
    isLoading,
    error,
    refetch: fetchPortfolioStatus,
  }
}
