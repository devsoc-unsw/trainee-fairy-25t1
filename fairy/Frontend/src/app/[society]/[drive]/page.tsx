"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Users, BookOpen, Megaphone, AlertCircle, ArrowLeft, SquareArrowOutUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

const Page = () => {
  const searchParams = useSearchParams()
  const societyId = searchParams.get("society_id")
  const driveId = searchParams.get("drive_id")

  const [society, setSociety] = useState<Society | null>(null)
  const [drive, setDrive] = useState<Drive | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!societyId || !driveId) {
      setError("Missing society_id or drive_id in query parameters")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [societyResponse, driveResponse, portfoliosResponse] = await Promise.all([
          fetch(`http://localhost:3000/apply/society/${societyId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/drive/${driveId}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:3000/apply/portfolios/${driveId}`, {
            credentials: "include",
          }),
        ])

        if (!societyResponse.ok || !driveResponse.ok || !portfoliosResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [societyData, driveData, portfoliosData] = await Promise.all([
          societyResponse.json(),
          driveResponse.json(),
          portfoliosResponse.json(),
        ])

        setSociety(societyData.society)
        setDrive(driveData.drive)
        setPortfolios(portfoliosData.portfolios)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [societyId, driveId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePortfolioClick = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio)
    setIsModalOpen(true)
  }

  const getPortfolioIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "education":
        return <BookOpen className="h-6 w-6" />
      case "marketing":
        return <Megaphone className="h-6 w-6" />
      default:
        return <Users className="h-6 w-6" />
    }
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

  const handleBackClick = () => {
    window.history.back()
  }

  const formatLink = (s_alias: string, d_name: string, p_name: string) => {
    return `${d_name.toLowerCase().replace(/\s+/g, '-')}/${p_name.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
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
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="flex items-center space-x-4 p-6">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Data</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main content (only renders when data is loaded)
  if (!society || !drive || !portfolios) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBackClick} className="flex items-center space-x-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        {/* Society and Drive Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Society Card */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={society.img_url || "/placeholder.svg"}
                  alt={society.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-xl">{society.alias}</CardTitle>
                  <CardDescription className="text-sm">{society.name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Established {formatDate(society.created_at)}
              </div>
            </CardContent>
          </Card>

          {/* Drive Card */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{drive.name}</CardTitle>
                <Badge variant={isRecruitmentOpen() ? "default" : "secondary"}>
                  {isRecruitmentOpen() ? "Open" : "Closed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Opens: {formatDate(drive.open_date)}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Closes: {formatDate(drive.close_date)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drive Description */}
        <Card>
          <CardHeader>
            <CardTitle>About the Recruitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">{drive.description}</p>
          </CardContent>
        </Card>

        {/* Portfolios Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Portfolios</h2>
          {portfolios.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No portfolios available for this drive.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Card
                  key={portfolio.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                  onClick={() => handlePortfolioClick(portfolio)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">{getPortfolioIcon(portfolio.name)}</div>
                      <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-2">{portfolio.description}</CardDescription>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {formatCapacity(portfolio.min_capacity, portfolio.max_capacity)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {selectedPortfolio && getPortfolioIcon(selectedPortfolio.name)}
                </div>
                <div>
                  <DialogTitle className="text-2xl">{selectedPortfolio?.name}</DialogTitle>
                  <DialogDescription>{society.alias}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {selectedPortfolio && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm leading-relaxed">{selectedPortfolio.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Application Period</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {selectedPortfolio.open_date
                          ? `Opens: ${formatDate(selectedPortfolio.open_date)}`
                          : "Opens: Same as drive"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {selectedPortfolio.close_date
                          ? `Closes: ${formatDate(selectedPortfolio.close_date)}`
                          : "Closes: Same as drive"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Capacity & Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {formatCapacity(selectedPortfolio.min_capacity, selectedPortfolio.max_capacity)}
                      </div>
                      <Badge variant={isRecruitmentOpen() ? "default" : "secondary"}>
                        {isRecruitmentOpen() ? "Applications Open" : "Applications Closed"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <Link href={{
                      pathname: formatLink(society.alias, drive.name, selectedPortfolio.name),
                      query: {
                        society_id: society.id,
                        drive_id: drive.id,
                        portfolio_id: selectedPortfolio.id,
                      },
                    }}
                    rel="noopener noreferrer"
                    target="_blank"
                    >
                      Apply
                      <SquareArrowOutUpRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Page
