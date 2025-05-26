"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { usePortfolioStatus } from "@/hooks/use-portfolio-status"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import type { ChartStatusData } from "@/types/portfolio-status"

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  accepted: {
    label: "Accepted",
    color: "oklch(72.3% 0.219 149.579)", // green-500
  },
  rejected: {
    label: "Rejected",
    color: "oklch(63.7% 0.237 25.331)", // red-500
  },
  pending: {
    label: "Pending",
    color: "oklch(76.9% 0.188 70.08)", // amber-500
  },
  waitlisted: {
    label: "Waitlisted",
    color: "oklch(62.3% 0.214 259.815)", // blue-500
  },
} satisfies ChartConfig

export function SmallChartApplicationStatus({ className }: { className?: string }) {
  const { data: portfolioData, isLoading, error } = usePortfolioStatus()
  const [selectedPortfolio, setSelectedPortfolio] = React.useState("all")
  const [activeStatus, setActiveStatus] = React.useState<string | null>(null) // Default to null for acceptance rate

  const chartData = React.useMemo((): ChartStatusData[] => {
    if (!portfolioData.length) return []

    if (selectedPortfolio === "all") {
      // Aggregate all portfolios
      const totals = portfolioData.reduce(
        (acc, portfolio) => ({
          accepted: acc.accepted + portfolio.accepted,
          rejected: acc.rejected + portfolio.rejected,
          pending: acc.pending + portfolio.pending,
          waitlisted: acc.waitlisted + portfolio.waitlisted,
        }),
        { accepted: 0, rejected: 0, pending: 0, waitlisted: 0 },
      )

      return [
        { status: "accepted", applicants: totals.accepted, fill: "var(--color-accepted)" },
        { status: "rejected", applicants: totals.rejected, fill: "var(--color-rejected)" },
        { status: "pending", applicants: totals.pending, fill: "var(--color-pending)" },
        { status: "waitlisted", applicants: totals.waitlisted, fill: "var(--color-waitlisted)" },
      ].filter((item) => item.applicants > 0) // Only show statuses with applications
    } else {
      // Show specific portfolio
      const portfolio = portfolioData.find((p) => p.portfolio_id === selectedPortfolio)
      if (!portfolio) return []

      return [
        { status: "accepted", applicants: portfolio.accepted, fill: "var(--color-accepted)" },
        { status: "rejected", applicants: portfolio.rejected, fill: "var(--color-rejected)" },
        { status: "pending", applicants: portfolio.pending, fill: "var(--color-pending)" },
        { status: "waitlisted", applicants: portfolio.waitlisted, fill: "var(--color-waitlisted)" },
      ].filter((item) => item.applicants > 0) // Only show statuses with applications
    }
  }, [portfolioData, selectedPortfolio])

  const activeIndex = React.useMemo(() => {
    if (!activeStatus) return -1
    return chartData.findIndex((item) => item.status === activeStatus)
  }, [chartData, activeStatus])

  const selectedTotal = React.useMemo(() => {
    if (!activeStatus) {
      // Show accepted count for acceptance rate calculation
      const acceptedData = chartData.find((data) => data.status === "accepted")
      return acceptedData?.applicants || 0
    }
    return chartData.find((data) => data.status === activeStatus)?.applicants || 0
  }, [chartData, activeStatus])

  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, [chartData])

  const selectedPortfolioName = React.useMemo(() => {
    if (selectedPortfolio === "all") return "All Portfolios"
    const portfolio = portfolioData.find((p) => p.portfolio_id === selectedPortfolio)
    return portfolio?.portfolio_name || "Unknown Portfolio"
  }, [portfolioData, selectedPortfolio])

  const onClick = (data: { status: React.SetStateAction<string | null> }) => {
    if (!data || !data.status) return
    if (data.status === activeStatus) {
      setActiveStatus(null) // Reset to acceptance rate view
    } else {
      setActiveStatus(data.status)
    }
  }

  if (isLoading) {
    return (
      <Card className={cn("flex flex-col gap-0 pb-0", className)}>
        <CardHeader className="flex items-start space-y-0 truncate">
          <div className="grid gap-1">
            <CardTitle>Statuses</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </div>
          <Skeleton className="ml-auto h-8 w-[150px]" />
        </CardHeader>
        <CardContent>
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !portfolioData.length) {
    return (
      <Card className={cn("flex flex-col gap-0 pb-0", className)}>
        <CardHeader className="flex items-start space-y-0 truncate">
          <div className="grid gap-1">
            <CardTitle>Statuses</CardTitle>
            <CardDescription>No data available</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center text-muted-foreground">
            {error || "No portfolio data found"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("flex flex-col gap-0 pb-0", className)}>
      <CardHeader className="flex items-start space-y-0 truncate">
        <div className="grid gap-1">
          <CardTitle>Statuses</CardTitle>
          <CardDescription>
            {selectedPortfolio === "all" ? <span>For all portfolios</span> : <span>For {selectedPortfolioName}</span>}
          </CardDescription>
        </div>
        <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
          <SelectTrigger className="ml-auto w-[150px] justify-between text-xs font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all" className="text-xs font-normal">
                All Portfolios
              </SelectItem>
              {portfolioData.map((portfolio) => (
                <SelectItem key={portfolio.portfolio_id} value={portfolio.portfolio_id} className="text-xs font-normal">
                  {portfolio.portfolio_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="applicants"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              paddingAngle={2}
              cornerRadius={2}
              activeIndex={activeIndex !== -1 ? activeIndex : undefined}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                </g>
              )}
              onClick={onClick}
              className="cursor-pointer"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        {!activeStatus ? (
                          <>
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {totalApplicants > 0 ? ((selectedTotal / totalApplicants) * 100).toFixed(1) : "0.0"}%
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              Acceptance rate
                            </tspan>
                          </>
                        ) : (
                          <>
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              {selectedTotal}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs">
                              {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}
                            </tspan>
                          </>
                        )}
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
