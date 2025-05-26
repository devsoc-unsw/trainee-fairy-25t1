"use client"

import { useState, useEffect, useCallback } from "react"
import type { Application, ApplicationQuestion, ApplicationDetails } from "@/types/application"

export function useApplicationDetails(applicant: Application | null) {
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuestions = useCallback(async (applicantData: Application) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3000/application/${applicantData.id}`, {
        credentials: "include", // Include credentials for authentication
      })

      if (!response.ok) {
        throw new Error("Failed to fetch application details")
      }

      const result = await response.json()
      const questions: ApplicationQuestion[] = result.application || []

      // Sort questions by order_index
      const sortedQuestions = questions.sort((a, b) => a.order_index - b.order_index)

      // Combine applicant data with questions
      const details: ApplicationDetails = {
        applicant: applicantData,
        questions: sortedQuestions,
      }

      setApplicationDetails(details)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setApplicationDetails(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (applicant) {
      fetchQuestions(applicant)
    } else {
      setApplicationDetails(null)
      setError(null)
      setLoading(false)
    }
  }, [applicant, fetchQuestions])

  const updateApplicationStatus = useCallback(
    async (newStatus: string) => {
      if (!applicationDetails) return { success: false, error: "No application loaded" }

      try {
        const response = await fetch("/api/applications/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: applicationDetails.applicant.id, status: newStatus }),
        })

        if (!response.ok) {
          throw new Error("Failed to update application status")
        }

        // Update local state
        setApplicationDetails((prev) =>
          prev
            ? {
                ...prev,
                applicant: { ...prev.applicant, status: newStatus as "pending" | "accepted" | "rejected" | "waitlisted" },
              }
            : null,
        )

        return { success: true }
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Update failed" }
      }
    },
    [applicationDetails],
  )

  return {
    applicationDetails,
    loading,
    error,
    refetch: applicant ? () => fetchQuestions(applicant) : () => {},
    updateApplicationStatus,
  }
}
