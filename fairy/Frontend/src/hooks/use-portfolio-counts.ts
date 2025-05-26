"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import type { PortfolioCount } from "@/types/portfolio"

export function usePortfolioCounts() {
  const [data, setData] = useState<PortfolioCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const driveId = searchParams.get("drive_id")

  const fetchPortfolioCounts = useCallback(async () => {
    if (!driveId) {
      setData([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`http://localhost:3000/application/counts/${driveId}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio counts")
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch portfolio counts"
      setError(errorMessage)
      toast.error("Failed to load portfolio data", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }, [driveId])

  useEffect(() => {
    fetchPortfolioCounts()
  }, [fetchPortfolioCounts])

  return {
    data,
    isLoading,
    error,
    refetch: fetchPortfolioCounts,
  }
}
