"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Check, X, Clock, UserCheck, MessageSquare, ExternalLink, Mail, User } from "lucide-react"
import { useApplicationDetails } from "@/hooks/use-application-details"
import type { Application, ApplicationQuestion } from "@/types/application"

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  accepted: {
    label: "Accepted",
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
  applicant: Application | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdate?: (id: string, status: string) => void
}

function QuestionAnswer({ question }: { question: ApplicationQuestion }) {
  const isUrl =
    question.answer.startsWith("http://") || question.answer.startsWith("https://") || question.answer.includes(".com")

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <MessageSquare className="h-4 w-4 mt-1 text-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 leading-relaxed">{question.question_label}</h4>
        </div>
      </div>
      <div className="ml-6">
        {isUrl ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={question.answer.startsWith("http") ? question.answer : `https://${question.answer}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Link
              </a>
            </Button>
            <span className="text-sm text-gray-500 truncate">{question.answer}</span>
          </div>
        ) : (
          <p className="text-sm bg-gray-50 p-3 rounded-md border-l-2 border-blue-200 whitespace-pre-wrap">
            {question.answer}
          </p>
        )}
      </div>
    </div>
  )
}

export function ApplicationModal({ applicant, isOpen, onOpenChange, onStatusUpdate }: ApplicationModalProps) {
  const { applicationDetails, loading, error, updateApplicationStatus } = useApplicationDetails(applicant)

  if (!applicant) return null

  const statusInfo = statusConfig[applicant.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo?.icon || Clock
  const handleStatusUpdate = async (newStatus: string) => {
    const result = await updateApplicationStatus(newStatus)
    if (result.success && onStatusUpdate) {
      onStatusUpdate(applicant.id, newStatus)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Application Details
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Applicant Information - Always visible */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg font-semibold">
                  {applicant.first_name} {applicant.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </label>
                <p className="text-sm">{applicant.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Portfolio</label>
                <Badge>{applicant.portfolio}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Application ID</label>
                <p className="text-sm font-mono bg-white p-2 rounded border">{applicant.id}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Questions and Answers Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Application Responses
            </h3>

            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-32 text-red-600 bg-red-50 rounded-lg">
                <p>Error loading application responses: {error}</p>
              </div>
            )}

            {applicationDetails && !loading && (
              <>
                {applicationDetails.questions.length > 0 ? (
                  <div className="space-y-6">
                    {applicationDetails.questions.map((question, index) => (
                      <div key={question.question_id}>
                        <QuestionAnswer question={question} />
                        {index < applicationDetails.questions.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                    No responses found for this application.
                  </p>
                )}
              </>
            )}
          </div>

          <Separator />

          {/* Status Update Section */}
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-3">Update Status</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusConfig).map(([status, config]) => {
                const Icon = config.icon
                const isCurrentStatus = applicant.status === status

                return (
                  <Button
                    key={status}
                    variant={isCurrentStatus ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusUpdate(status)}
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
