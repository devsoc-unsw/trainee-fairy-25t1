"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Plus, Calendar, Users, X, FileText, Trash2, Edit3 } from "lucide-react"

interface Portfolio {
  id: string
  description: string | null
  max_capacity: number
  min_capacity: number
  name: string
}

interface RecruitmentDrive {
  name: string
  description: string
  open_date: string
  close_date: string
  created_at: string
  portfolio_ids: string[]
}

interface FormQuestion {
  id: string
  question: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio"
  required: boolean
  options?: string[] // For select, checkbox, radio types
  portfolios: string[] // Portfolio IDs this question applies to ('all' means all portfolios)
}

interface RecruitmentDriveFormProps {
  onClose?: () => void
  portfolios?: Portfolio[] // Made optional with default
  societyId?: string // Made optional with default
}

export default function RecruitmentDriveForm({
  onClose,
  portfolios: propPortfolios = [], // Default to empty array
  societyId = "", // Default to empty string
}: RecruitmentDriveFormProps) {
  const [step, setStep] = useState<"form" | "portfolio" | "success">("form")
  const [availablePortfolios, setAvailablePortfolios] = useState<Portfolio[]>(propPortfolios || [])

  const [driveData, setDriveData] = useState<RecruitmentDrive>({
    name: "",
    description: "",
    open_date: "",
    close_date: "",
    created_at: new Date().toISOString(),
    portfolio_ids: [],
  })

  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([])
  const [selectedNewPortfolios, setSelectedNewPortfolios] = useState<{ name: string; description: string }[]>([])
  const [newPortfolio, setNewPortfolio] = useState({ name: "", description: "" })
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)
  const [createdDrive, setCreatedDrive] = useState<RecruitmentDrive | null>(null)
  const [driveId, setDriveId] = useState<string[]>()

  // Form builder state
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([])
  const [newQuestion, setNewQuestion] = useState<Partial<FormQuestion>>({
    question: "",
    type: "text",
    required: false,
    portfolios: [],
    options: [],
  })
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)

  useEffect(() => {
    if (propPortfolios && Array.isArray(propPortfolios)) {
      setAvailablePortfolios(propPortfolios)
    }
  }, [propPortfolios])

  const handleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!driveData.name || !driveData.description || !driveData.open_date || !driveData.close_date) {
      return
    }
    setStep("portfolio")
  }

  const handlePortfolioToggle = (portfolioId: string) => {
    setSelectedPortfolios((prev) =>
      prev.includes(portfolioId) ? prev.filter((id) => id !== portfolioId) : [...prev, portfolioId],
    )
  }

  const handleCreatePortfolio = () => {
    if (!newPortfolio.name || !newPortfolio.description) return

    const newPortfolioId = `new-${Date.now()}`
    const portfolio: Portfolio = {
      id: newPortfolioId,
      name: newPortfolio.name,
      description: newPortfolio.description,
      max_capacity: 0,
      min_capacity: 0,
    }

    setAvailablePortfolios((prev) => [...prev, portfolio])
    setSelectedNewPortfolios((prev) => [...prev, { name: newPortfolio.name, description: newPortfolio.description }])
    setNewPortfolio({ name: "", description: "" })
    setShowCreatePortfolio(false)
  }

  const handlePortfolioSelection = async () => {
    if (selectedPortfolios.length === 0) {
      return
    }

    const finalDrive: RecruitmentDrive = {
      ...driveData,
      portfolio_ids: selectedPortfolios,
      created_at: new Date().toISOString(),
    }

    // Only make API calls if societyId is provided
    if (societyId) {
      try {
        const response = await fetch("http://localhost:3000/drives/create", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: driveData.name,
            description: driveData.description,
            societyId,
            open_date: driveData.open_date,
            close_date: driveData.close_date,
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setDriveId(result.drive[0].id)
          const tempdrivId = result.drive[0].id
          const createdPortfolios: Portfolio[] = []

          for (const portfolio of selectedNewPortfolios) {
            console.log(portfolio)
            const res = await fetch("http://localhost:3000/portfolio/create", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: portfolio.name,
                description: portfolio.description,
                driveId: tempdrivId,
              }),
            })

            const data = await res.json()

            if (res.ok && data?.portfolio?.[0]) {
              const newPort: Portfolio = data.portfolio[0]
              createdPortfolios.push(newPort)
            }
          }

          await Promise.all(
            selectedPortfolios
              .filter((portfolioId) => !portfolioId.startsWith("new-")) // Filter out new portfolios
              .map(async (portfolioId) => {
                try {
                  await fetch(`http://localhost:3000/portfolio/update-drive/${portfolioId}`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ driveId }),
                  })
                } catch (error) {
                  console.error(`Error updating portfolio ${portfolioId}:`, error)
                }
              }),
          )

          setAvailablePortfolios((prev) => [...prev, ...createdPortfolios])
          setSelectedPortfolios((prev) => [
            ...prev.filter((id) => !id.startsWith("new-")),
            ...createdPortfolios.map((p) => p.id),
          ])
        } else {
          console.error(`Error: ${result.error}`)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      }
    }

    setCreatedDrive(finalDrive)
    setStep("success")
  }

  const resetForm = () => {
    setStep("form")
    setDriveData({
      name: "",
      description: "",
      open_date: "",
      close_date: "",
      created_at: new Date().toISOString(),
      portfolio_ids: [],
    })
    setSelectedPortfolios([])
    setNewPortfolio({ name: "", description: "" })
    setShowCreatePortfolio(false)
    setCreatedDrive(null)
    setFormQuestions([])
    setNewQuestion({
      question: "",
      type: "text",
      required: false,
      portfolios: [],
      options: [],
    })
    setShowAddQuestion(false)
    setEditingQuestion(null)
  }

  const getSelectedPortfolioNames = (portfolioIds: string[]) => {
    if (!Array.isArray(portfolioIds) || !Array.isArray(availablePortfolios)) {
      return []
    }
    return portfolioIds.map((id) => availablePortfolios.find((p) => p.id === id)?.name).filter(Boolean)
  }

  const getSelectedPortfolios = () => {
    if (!Array.isArray(availablePortfolios) || !Array.isArray(selectedPortfolios)) {
      return []
    }
    // Use Set to remove duplicates and filter selected portfolios
    const uniqueSelectedIds = [...new Set(selectedPortfolios)]
    return availablePortfolios.filter((p) => uniqueSelectedIds.includes(p.id))
  }

  const handleAddQuestion = () => {
    if (!newQuestion.question) return

    // Handle "All portfolios" selection - if no specific portfolios are selected,
    // add all selected portfolios from the drive
    let questionPortfolios = newQuestion.portfolios || []
    if (questionPortfolios.length === 0) {
      // "All portfolios" is selected, so add all portfolios from selectedPortfolios
      questionPortfolios = [...selectedPortfolios.filter((id) => !id.startsWith("new-"))]
    }

    const question: FormQuestion = {
      id: editingQuestion || `q-${Date.now()}`,
      question: newQuestion.question,
      type: newQuestion.type || "text",
      required: newQuestion.required || false,
      options: newQuestion.options || [],
      portfolios: questionPortfolios,
    }

    if (editingQuestion) {
      setFormQuestions((prev) => prev.map((q) => (q.id === editingQuestion ? question : q)))
      setEditingQuestion(null)
    } else {
      setFormQuestions((prev) => [...prev, question])
    }

    setNewQuestion({
      question: "",
      type: "text",
      required: false,
      portfolios: [],
      options: [],
    })
    setShowAddQuestion(false)
  }

  const handleEditQuestion = (questionId: string) => {
    const question = formQuestions.find((q) => q.id === questionId)
    if (question) {
      setNewQuestion(question)
      setEditingQuestion(questionId)
      setShowAddQuestion(true)
    }
  }

  const handleDeleteQuestion = (questionId: string) => {
    setFormQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const handlePortfolioSelectionForQuestion = (portfolioId: string) => {
    setNewQuestion((prev) => {
      const currentPortfolios = prev.portfolios || []
      const isCurrentlySelected = currentPortfolios.includes(portfolioId)

      if (isCurrentlySelected) {
        // Remove the portfolio
        return {
          ...prev,
          portfolios: currentPortfolios.filter((id) => id !== portfolioId),
        }
      } else {
        // Add the portfolio
        return {
          ...prev,
          portfolios: [...currentPortfolios, portfolioId],
        }
      }
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options?.map((opt, i) => (i === index ? value : opt)) || [],
    }))
  }

  const addOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...(prev.options || []), ""],
    }))
  }

  const removeOption = (index: number) => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || [],
    }))
  }

  const getPortfolioNamesForQuestion = (portfolioIds: string[]) => {
    if (!Array.isArray(portfolioIds) || portfolioIds.length === 0) return "All portfolios"
    if (!Array.isArray(availablePortfolios)) return "All portfolios"

    // Check if this question applies to all selected portfolios
    const selectedPortfolioIds = selectedPortfolios.filter((id) => !id.startsWith("new-"))
    const isAllSelectedPortfolios =
      selectedPortfolioIds.length > 0 &&
      selectedPortfolioIds.every((id) => portfolioIds.includes(id)) &&
      portfolioIds.length === selectedPortfolioIds.length

    if (isAllSelectedPortfolios) {
      return "All portfolios"
    }

    return portfolioIds
      .map((id) => availablePortfolios.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(", ")
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  if (step === "success") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <Card className="w-full max-w-2xl mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          {onClose && (
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 z-10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-green-600">Drive Created Successfully!</CardTitle>
                <CardDescription className="text-sm">Now create the application form</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-0">
            {/* Drive Summary */}
            {createdDrive && (
              <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">{createdDrive.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getSelectedPortfolioNames(createdDrive.portfolio_ids).map((name, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Form Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Application Form Questions</h3>
                </div>
                <Button onClick={() => setShowAddQuestion(true)} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Question
                </Button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {formQuestions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                          <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                            {question.type}
                          </span>
                          {question.required && (
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-sm font-medium">{question.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          For: {getPortfolioNamesForQuestion(question.portfolios)}
                        </p>
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Options:</p>
                            <div className="flex flex-wrap gap-1">
                              {question.options.map((option, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuestion(question.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {formQuestions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No questions added yet</p>
                    <p className="text-xs">Click "Add Question" to get started</p>
                  </div>
                )}
              </div>

              {/* Add Question Form */}
              {showAddQuestion && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{editingQuestion ? "Edit Question" : "Add New Question"}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddQuestion(false)
                        setEditingQuestion(null)
                        setNewQuestion({
                          question: "",
                          type: "text",
                          required: false,
                          portfolios: [],
                          options: [],
                        })
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-sm">Question *</Label>
                      <Textarea
                        value={newQuestion.question || ""}
                        onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                        placeholder="Enter your question"
                        className="min-h-[60px] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-sm">Question Type</Label>
                        <Select
                          value={newQuestion.type || "text"}
                          onValueChange={(value: any) => setNewQuestion((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="radio">Multiple Choice</SelectItem>
                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-sm">Required</Label>
                        <div className="flex items-center space-x-2 h-8">
                          <Checkbox
                            checked={newQuestion.required || false}
                            onCheckedChange={(checked) => setNewQuestion((prev) => ({ ...prev, required: !!checked }))}
                          />
                          <span className="text-sm">Required field</span>
                        </div>
                      </div>
                    </div>

                    {/* Options for select/radio/checkbox */}
                    {(newQuestion.type === "select" ||
                      newQuestion.type === "radio" ||
                      newQuestion.type === "checkbox") && (
                      <div className="space-y-2">
                        <Label className="text-sm">Options</Label>
                        {(newQuestion.options || []).map((option, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="h-7 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOption(index)}
                              className="h-7 w-7 p-0 text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addOption}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    )}

                    {/* Portfolio Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm">Apply to Portfolios</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={(newQuestion.portfolios?.length || 0) === 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewQuestion((prev) => ({ ...prev, portfolios: [] }))
                              } else {
                                // When unchecking "All portfolios", don't automatically select any specific portfolios
                                setNewQuestion((prev) => ({ ...prev, portfolios: [] }))
                              }
                            }}
                          />
                          <span className="text-sm">All portfolios</span>
                        </div>
                        {getSelectedPortfolios().map((portfolio) => (
                          <div key={portfolio.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={newQuestion.portfolios?.includes(portfolio.id) || false}
                              onCheckedChange={() => handlePortfolioSelectionForQuestion(portfolio.id)}
                              disabled={false} // Remove the disabled condition that was preventing selection
                            />
                            <span className="text-sm">{portfolio.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddQuestion} size="sm" className="flex-1">
                        {editingQuestion ? "Update Question" : "Add Question"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={resetForm} variant="outline" className="flex-1" size="sm">
                Create Another Drive
              </Button>
              <Button
                onClick={async () => {
                  // Log the form questions
                  console.log("Form Questions:", formQuestions)

                  // Create the form via API if we have questions and societyId
                  if (formQuestions.length > 0 && societyId && createdDrive) {
                    try {
                      const response = await fetch("http://localhost:3000/drives/form/create", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          driveId: driveId, // Assuming this contains the drive ID from backend
                          questions: formQuestions,
                          societyId: societyId,
                        }),
                      })
                      

                      const result = await response.json()

                      if (response.ok) {
                        console.log("Form created successfully:", result)
                      } else {
                        console.error("Failed to create form:", result.error)
                      }
                    } catch (error) {
                      console.error("Error creating form:", error)
                    }
                  } else if (formQuestions.length === 0) {
                    console.log("No questions to save - form creation skipped")
                  }

                  // Close the modal
                  onClose?.()
                }}
                className="flex-1"
                size="sm"
              >
                Finish & Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "portfolio") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <Card className="w-full max-w-md mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          {onClose && (
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 z-10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Add to Portfolios</CardTitle>
            <CardDescription className="text-sm">
              Select one or more portfolios for your recruitment drive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {!Array.isArray(availablePortfolios) || availablePortfolios.length === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">
                  No portfolio exists. Please add a portfolio to proceed.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Select Portfolios</Label>
                  <div className="space-y-2 mt-2">
                    {availablePortfolios.map((portfolio) => (
                      <div
                        key={portfolio.id}
                        className="flex items-start space-x-3 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => handlePortfolioToggle(portfolio.id)}
                      >
                        <Checkbox
                          id={`portfolio-${portfolio.id}`}
                          checked={selectedPortfolios.includes(portfolio.id)}
                          onCheckedChange={() => handlePortfolioToggle(portfolio.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`portfolio-${portfolio.id}`} className="text-sm font-medium cursor-pointer">
                            {portfolio.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">{portfolio.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedPortfolios.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>{selectedPortfolios.length}</strong> portfolio
                        {selectedPortfolios.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowCreatePortfolio(!showCreatePortfolio)}
                className="w-full"
                size="sm"
              >
                <Plus className="mr-2 h-3 w-3" />
                Create New Portfolio
              </Button>

              {showCreatePortfolio && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
                  <div className="space-y-1">
                    <Label htmlFor="portfolio-name" className="text-sm">
                      Portfolio Name
                    </Label>
                    <Input
                      id="portfolio-name"
                      value={newPortfolio.name}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
                      placeholder="Enter portfolio name"
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="portfolio-description" className="text-sm">
                      Portfolio Description
                    </Label>
                    <Textarea
                      id="portfolio-description"
                      value={newPortfolio.description}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                      placeholder="Enter portfolio description"
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                  <Button
                    onClick={handleCreatePortfolio}
                    disabled={!newPortfolio.name || !newPortfolio.description}
                    className="w-full"
                    size="sm"
                  >
                    Create and Select Portfolio
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep("form")} className="flex-1" size="sm">
                Back
              </Button>
              <Button
                onClick={handlePortfolioSelection}
                disabled={selectedPortfolios.length === 0}
                className="flex-1"
                size="sm"
              >
                Add to {selectedPortfolios.length} Portfolio{selectedPortfolios.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        {onClose && (
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 z-10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4" />
            Society Recruitment Drive
          </CardTitle>
          <CardDescription className="text-sm">Create a new recruitment drive for your society.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleDriveSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm">
                Drive Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={driveData.name}
                onChange={(e) => setDriveData({ ...driveData, name: e.target.value })}
                placeholder="Enter recruitment drive name"
                required
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm">
                Description *
              </Label>
              <Textarea
                id="description"
                value={driveData.description}
                onChange={(e) => setDriveData({ ...driveData, description: e.target.value })}
                placeholder="Describe the recruitment drive, requirements, and expectations"
                className="min-h-[80px] text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="open_date" className="text-sm">
                  Open Date *
                </Label>
                <div className="relative">
                  <Input
                    id="open_date"
                    type="datetime-local"
                    value={driveData.open_date}
                    onChange={(e) => setDriveData({ ...driveData, open_date: e.target.value })}
                    required
                    className="h-8 text-sm pr-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="close_date" className="text-sm">
                  Close Date *
                </Label>
                <div className="relative">
                  <Input
                    id="close_date"
                    type="datetime-local"
                    value={driveData.close_date}
                    onChange={(e) => setDriveData({ ...driveData, close_date: e.target.value })}
                    required
                    className="h-8 text-sm pr-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="created_at" className="text-sm">
                Created At
              </Label>
              <div className="relative">
                <Input
                  id="created_at"
                  type="datetime-local"
                  value={driveData.created_at.slice(0, 16)}
                  onChange={(e) => setDriveData({ ...driveData, created_at: new Date(e.target.value).toISOString() })}
                  disabled
                  className="h-8 text-sm pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">
                This field is automatically set to the current date and time.
              </p>
            </div>

            <Button type="submit" className="w-full" size="sm">
              <Calendar className="mr-2 h-3 w-3" />
              Continue to Portfolio Selection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
