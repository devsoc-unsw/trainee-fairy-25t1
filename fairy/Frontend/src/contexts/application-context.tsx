"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface ApplicationContextType {
  statusUpdateTrigger: number
  triggerStatusUpdate: () => void
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [statusUpdateTrigger, setStatusUpdateTrigger] = useState(0)

  const triggerStatusUpdate = useCallback(() => {
    setStatusUpdateTrigger((prev) => prev + 1)
  }, [])

  return (
    <ApplicationContext.Provider value={{ statusUpdateTrigger, triggerStatusUpdate }}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error("useApplicationContext must be used within an ApplicationProvider")
  }
  return context
}
