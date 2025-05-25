"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

import { set, useForm } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner";

// TypeScript interfaces
interface Society {
  id: string
  name: string
  description: string | null
  img_url: string
  created_at: string
  alias: string
}

interface Drive {
  id: string
  name: string
  description: string
  open_date: string
  close_date: string
  created_at: string
  society: string
}

interface Portfolio {
  id: string
  created_at: string
  name: string
  description: string
  open_date: string | null
  close_date: string | null
  drive: string
  min_capacity: number
  max_capacity: number
}

interface Question {
  id: string
  label: string
  description: string | null
  is_required: boolean
  order_index: number
  portfolio: string
  created_at: string
}

type FormData = Record<string, string>

const ApplicationPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const societyId = searchParams.get("society_id")
  const driveId = searchParams.get("drive_id")
  const portfolioId = searchParams.get("portfolio_id")
  const applicationId = searchParams.get("application_id")

  const [society, setSociety] = useState<Society | null>(null)
  const [drive, setDrive] = useState<Drive | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>()

  useEffect(() => {
    if (!societyId || !driveId || !portfolioId) {
      setError("Missing required parameters")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [societyResponse, driveResponse, portfolioResponse, questionsResponse, applicationResponse, answersResponse] = await Promise.all([
          fetch(`http://localhost:3000/apply/society/${societyId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/drive/${driveId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/portfolio/${portfolioId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/questions/${portfolioId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/application/status/${applicationId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/answers/${applicationId}`, {
            credentials: "include",
          }),
        ])

        if (societyResponse.status === 401) {
          setError("You must be logged in to view this page.")
          setLoading(false)
          router.push("/auth")
          return
        }

        if (!societyResponse.ok || !driveResponse.ok || !portfolioResponse.ok || !questionsResponse.ok ||!applicationResponse.ok || !answersResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [societyData, driveData, portfolioData, questionsData, applicationData, answersData] = await Promise.all([
          societyResponse.json(),
          driveResponse.json(),
          portfolioResponse.json(),
          questionsResponse.json(),
          applicationResponse.json(),
          answersResponse.json(),
        ])

        setSociety(societyData.society)
        setDrive(driveData.drive)
        setPortfolio(portfolioData.portfolio)
        setQuestions(questionsData.questions.sort((a: Question, b: Question) => a.order_index - b.order_index))
        setAnswers(answersData.answers || [])

        if (applicationData.status === "submitted") {
          setSubmitted(true)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load application form. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [societyId, driveId, portfolioId, applicationId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCapacity = (minCapacity: number, maxCapacity: number) => {
    if (minCapacity === maxCapacity) {
      return `${minCapacity} ${minCapacity === 1 ? "person" : "people"}`
    }
    return `${minCapacity}-${maxCapacity} people`
  }

  const isRecruitmentOpen = () => {
    if (!drive) return false
    const now = new Date()
    const openDate = new Date(drive.open_date)
    const closeDate = new Date(drive.close_date)
    return now >= openDate && now <= closeDate
  }

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true)
      console.log(data)
      // Transform form data to include question IDs
      const answers = questions.map((question) => ({
        question_id: question.id,
        answer: data[question.id]
      }))

      const response = await fetch("http://localhost:3000/apply/answers/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          applicationId: applicationId,
          answers,
          isFinalSubmission: true,
        }),
      })

      const result = await response.json()
      console.log("Submission result:", result)
      if (result.error) {
        throw new Error(result.error)
      }
      if (!response.ok) {
        throw new Error("Failed to submit application")
      }
      setSubmitted(true)
      reset()
    } catch (error) {
      console.error("Error submitting application:", error)
      setError(`${error}}`)
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestionField = (question: Question) => {
    const isLongText = question.label.length > 100 || question.description

    const existingAnswer = answers.find((answer: any) => answer.question === question.id)?.answer || ""

    return (
      <div key={question.id} className="space-y-2">
        <Label htmlFor={question.id} className="text-sm font-medium">
          {question.label}
          {question.is_required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
        {isLongText ? (
          <Textarea
            id={question.id}
            placeholder="Enter your response..."
            defaultValue={existingAnswer}
            className="min-h-[100px]"
            {...register(question.id, {
              required: question.is_required ? "This field is required" : false,
            })}
          />
        ) : (
          <Input
            id={question.id}
            placeholder="Enter your response..."
            defaultValue={existingAnswer}
            {...register(question.id, {
              required: question.is_required ? "This field is required" : false,
            })}
          />
        )}
        {errors[question.id] && <p className="text-sm text-red-500">{errors[question.id]?.message}</p>}
      </div>
    )
  }

  const handleSaveDraft = async () => {
    try {
      setSaving(true)
  
      const currentValues = getValues()
  
      const draftAnswers = questions.map((question) => ({
        question_id: question.id,
        answer: currentValues[question.id] || "",
      }))
  
      const response = await fetch("http://localhost:3000/apply/answers/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          applicationId,
          answers: draftAnswers,
          isFinalSubmission: false,
        }),
      })
  
      const result = await response.json()
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to save draft")
      }
  
      // Optionally notify the user
      console.log("Draft saved successfully.")
      toast.success("Draft saved successfully.", {
        description: "Your application draft has been saved.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving draft:", error)
      setError(`${error}`)
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-10 w-20" />
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="flex items-center space-x-4 p-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Application</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-200">
            <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div>
                <h3 className="text-2xl font-semibold text-green-800 mb-2">Application Submitted!</h3>
                <p className="text-green-600 mb-4">
                  Your application for {portfolio?.name} has been successfully submitted.
                </p>
                <p className="text-sm text-muted-foreground">
                  You should receive a confirmation email shortly. The {society?.alias} team will review your
                  application and get back to you soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main content (only renders when data is loaded)
  if (!society || !drive || !portfolio) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Application Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img
                src={society.img_url || "/placeholder.svg"}
                alt={society.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <CardTitle className="text-2xl">{portfolio.name} Application Form</CardTitle>
                <CardDescription className="text-base">
                  {society.alias} • {drive.name}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={isRecruitmentOpen() ? "default" : "secondary"}>
                  {isRecruitmentOpen() ? "Applications Open" : "Applications Closed"}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  {formatCapacity(portfolio.min_capacity, portfolio.max_capacity)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Opens: {formatDate(portfolio.open_date ?? drive.open_date)}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Closes: {formatDate(portfolio.close_date ?? drive.close_date)}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm">{portfolio.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle>Application Questions</CardTitle>
            <CardDescription>Please answer all required questions. Fields marked with * are mandatory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {questions.map(renderQuestionField)}

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Draft"
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={submitting || !isRecruitmentOpen()}
                  className="min-w-[120px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApplicationPage
