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
import { CheckCircle, Plus, Calendar, Users, Folder, X } from "lucide-react"

interface Portfolio {
  id: string;
  description: string | null;
  max_capacity: number;
  min_capacity: number;
  name: string;
}

interface RecruitmentDrive {
  name: string
  description: string
  open_date: string
  close_date: string
  created_at: string
  portfolio_ids: string[]
}

interface RecruitmentDriveFormProps {
  onClose?: () => void
  portfolios: Portfolio[] // Ensure this prop is typed correctly as an array of Portfolio
  societyId: string
}

export default function RecruitmentDriveForm({ onClose, portfolios: propPortfolios, societyId }: RecruitmentDriveFormProps) {
  const [step, setStep] = useState<"form" | "portfolio" | "success">("form")
  // Use the portfolios passed as a prop, not a hardcoded state
  const [availablePortfolios, setAvailablePortfolios] = useState<Portfolio[]>(propPortfolios);


  const [driveData, setDriveData] = useState<RecruitmentDrive>({
    name: "",
    description: "",
    open_date: "",
    close_date: "",
    created_at: new Date().toISOString(),
    portfolio_ids: [],
  })

  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>([])
  const [selectedNewPortfolios, setSelectedNewPortfolios] = useState<{name: string, description: string}[]>([])
  const [newPortfolio, setNewPortfolio] = useState({ name: "", description: "" })
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false)
  const [createdDrive, setCreatedDrive] = useState<RecruitmentDrive | null>(null)

  // Initialize availablePortfolios when the prop changes
  useEffect(() => {
    setAvailablePortfolios(propPortfolios);
  }, [propPortfolios]);


  const handleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!driveData.name || !driveData.description || !driveData.open_date || !driveData.close_date) {
      // You might want to add a more visible error message to the user here
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

    // Generate a unique ID for the new portfolio (for client-side demonstration)
    // In a real application, this ID would likely come from your backend after creation
    const newPortfolioId = `new-${Date.now()}`;
    const portfolio: Portfolio = {
      id: newPortfolioId,
      name: newPortfolio.name,
      description: newPortfolio.description,
      max_capacity: 0,
      min_capacity: 0
    }

    setAvailablePortfolios((prev) => [...prev, portfolio]) // Add to available portfolios
    // setSelectedPortfolios((prev) => [...prev, newPortfolioId]) // Select the newly created one
    setSelectedNewPortfolios(prev => [...prev, { name: newPortfolio.name, description: newPortfolio.description }])
    setNewPortfolio({ name: "", description: "" })
    setShowCreatePortfolio(false)
  }

  const handlePortfolioSelection = async () => {
    if (selectedPortfolios.length === 0) {
      // Consider showing a warning to the user if no portfolios are selected
      return
    }

    const finalDrive: RecruitmentDrive = {
      ...driveData,
      portfolio_ids: selectedPortfolios,
      created_at: new Date().toISOString(), // Ensure created_at is updated on final submission
    }
    
    console.log(driveData)
    try {
      const response = await fetch('http://localhost:3000/drives/create', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // ✅ Required
        },
        body: JSON.stringify({
          name: driveData.name,
          description: driveData.description,
          societyId,
          open_date: driveData.open_date,
          close_date: driveData.close_date
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("drive created"); // You can use this as needed
        console.log(result)
        const driveId = result.drive[0].id;
        console.log(driveId)

        // Create all new portfolios associated with this drive
        await Promise.all(selectedNewPortfolios.map(portfolio => 
          fetch('http://localhost:3000/portfolio/create', {
            method: 'POST',
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: portfolio.name,
              description: portfolio.description,
              driveId: driveId,
            }),
          })
        ));

      
        
        // Now update the driveId of all existing selected portfolios
        await Promise.all(selectedPortfolios.map(async (portfolioId) => {
          // Skip portfolios that were just created (handled separately)
          if (portfolioId.startsWith("new-")) return;

          console.log(portfolioId);
          try {
            const response = await fetch(`http://localhost:3000/portfolio/update-drive/${portfolioId}`, {
              method: 'PATCH',
              credentials: "include",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ driveId }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error(`Failed to update driveId for portfolio ${portfolioId}:`, errorData.error);
            }
          } catch (error) {
            console.error(`Unexpected error updating portfolio ${portfolioId}:`, error);
          }
        }));


      } else {
        console.error(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
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
  }

  const getSelectedPortfolioNames = (portfolioIds: string[]) => {
    // Use availablePortfolios for lookup
    return portfolioIds.map((id) => availablePortfolios.find((p) => p.id === id)?.name).filter(Boolean)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    //window.location.reload();
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
        <Card className="w-full max-w-md mx-auto relative animate-in fade-in-0 zoom-in-95 duration-300">
          {onClose && (
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-600">Drive Created Successfully!</CardTitle>
            <CardDescription className="text-sm">
              Your recruitment drive has been created and added to the selected portfolios.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {createdDrive && (
              <div className="rounded-lg border p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">{createdDrive.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{createdDrive.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-medium">Opens:</span>
                    <p className="text-muted-foreground">{new Date(createdDrive.open_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Closes:</span>
                    <p className="text-muted-foreground">{new Date(createdDrive.close_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium flex items-center gap-2 mb-2 text-sm">
                    <Folder className="h-3 w-3" />
                    Portfolios ({createdDrive.portfolio_ids.length}):
                  </span>
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
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={resetForm} className="flex-1" size="sm">
                Create Another Drive
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="outline" className="flex-1" size="sm">
                  Close
                </Button>
              )}
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
            {availablePortfolios.length === 0 ? ( // Use availablePortfolios here
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
                    {availablePortfolios.map((portfolio) => ( // Use availablePortfolios here
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
                <Input
                  id="open_date"
                  type="datetime-local"
                  value={driveData.open_date}
                  onChange={(e) => setDriveData({ ...driveData, open_date: e.target.value })}
                  required
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="close_date" className="text-sm">
                  Close Date *
                </Label>
                <Input
                  id="close_date"
                  type="datetime-local"
                  value={driveData.close_date}
                  onChange={(e) => setDriveData({ ...driveData, close_date: e.target.value })}
                  required
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="created_at" className="text-sm">
                Created At
              </Label>
              <Input
                id="created_at"
                type="datetime-local"
                value={driveData.created_at.slice(0, 16)}
                onChange={(e) => setDriveData({ ...driveData, created_at: new Date(e.target.value).toISOString() })}
                disabled
                className="h-8 text-sm"
              />
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