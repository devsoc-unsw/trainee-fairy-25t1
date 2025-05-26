"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Clock, UserCheck } from "lucide-react"
import type { Application } from "@/types/application"

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  accepted: {
    label: "Approved",
    variant: "default" as const,
    icon: Check,
    color: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: X,
    color: "bg-red-100 text-red-800 border-red-200",
  },
  waitlisted: {
    label: "Waitlisted",
    variant: "outline" as const,
    icon: UserCheck,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
}

interface ApplicationModalProps {
  application: Application | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (id: string, status: string) => void
}

export function ApplicationModal({ application, isOpen, onOpenChange, onUpdateStatus }: ApplicationModalProps) {
  if (!application) return null

  const statusInfo = statusConfig[application.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo?.icon || Clock

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Application Details
            <Badge className={statusInfo?.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo?.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">First Name</label>
              <p className="text-lg font-semibold">{application.first_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Name</label>
              <p className="text-lg font-semibold">{application.last_name}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{application.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Portfolio</label>
            <Badge variant="outline" className="text-sm">
              {application.portfolio}
            </Badge>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Application ID</label>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{application.id}</p>
          </div>

          <div className="border-t pt-4">
            <label className="text-sm font-medium text-gray-500 block mb-3">Update Status</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon
                const isCurrentStatus = application.status === status

                return (
                  <Button
                    key={status}
                    variant={isCurrentStatus ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateStatus(application.id, status)}
                    disabled={isCurrentStatus}
                    className={isCurrentStatus ? config.color : ""}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
