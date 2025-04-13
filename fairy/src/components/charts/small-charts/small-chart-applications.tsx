"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Label, Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Check, ChevronsUpDown } from "lucide-react"

const chartData = [
  { portfolio: "careers", applications: 142, fill: "var(--color-careers)" },
  { portfolio: "competitions", applications: 55, fill: "var(--color-competitions)" },
  { portfolio: "creative", applications: 39, fill: "var(--color-creative)" },
  { portfolio: "digital", applications: 32, fill: "var(--color-digital)" },
  { portfolio: "education", applications: 74, fill: "var(--color-education)" },
  { portfolio: "events", applications: 86, fill: "var(--color-events)" },
  { portfolio: "hr", applications: 95, fill: "var(--color-hr)" },
  { portfolio: "it", applications: 78, fill: "var(--color-it)" },
  { portfolio: "marketing", applications: 78, fill: "var(--color-marketing)" },
  { portfolio: "media", applications: 60, fill: "var(--color-media)" },
  { portfolio: "outreach", applications: 73, fill: "var(--color-outreach)" },
  { portfolio: "socials", applications: 69, fill: "var(--color-socials)" },
]

const chartConfig = {
  careers: {
    label: "Careers",
    color: "oklch(63.7% 0.237 25.331)", // red-500
  },
  competitions: {
    label: "Competitions",
    color: "oklch(70.5% 0.213 47.604)", // orange-500
  },
  creative: {
    label: "Creative",
    color: "oklch(79.5% 0.184 86.047)", // yellow-500
  },
  digital: {
    label: "Digital",
    color: "oklch(76.8% 0.233 130.85)", // lime-500
  },
  education: {
    label: "Education",
    color: "oklch(72.3% 0.219 149.579)", // green-500
  },
  events: {
    label: "Events",
    color: "oklch(69.6% 0.17 162.48)", // emerald-500
  },
  hr: {
    label: "HR",
    color: "oklch(71.5% 0.143 215.221)", // cyan-500
  },
  it: {
    label: "IT",
    color: "oklch(62.3% 0.214 259.815)", // blue-500
  },
  marketing: {
    label: "Marketing",
    color: "oklch(58.5% 0.233 277.117)", // indigo-500
  },
  media: {
    label: "Media",
    color: "oklch(60.6% 0.25 292.717)", // violet-500
  },
  outreach: {
    label: "Outreach",
    color: "oklch(62.7% 0.265 303.9)", // purple-500
  },
  socials: {
    label: "Socials",
    color: "oklch(66.7% 0.295 322.15)", // fuchsia-500
  },
} satisfies ChartConfig

export function SmallChartApplicantions({ className }: { className?: string }) {
  // TODO: set active portfolio based on logged in director
  const [activePortfolio, setActivePortfolio] = React.useState<string>("competitions")
  const [open, setOpen] = React.useState(false)

  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applications, 0)
  }, [])
  const activeIndex = React.useMemo(() => {
    if (activePortfolio === "all") return -1;
    return chartData.findIndex((item) => item.portfolio === activePortfolio)
  }, [activePortfolio])
  const portfolios = React.useMemo(() => ["all", ...chartData.map((item) => item.portfolio)], [])
  const portfolioTotal = React.useMemo(() => {
    if (activePortfolio === "all") return totalApplicants
    const index = chartData.findIndex((item) => item.portfolio === activePortfolio)
    return index >= 0 ? chartData[index].applications : totalApplicants
  }, [activePortfolio, totalApplicants])

  // Handle pie sector click
  const handlePieClick = (data: { name: React.SetStateAction<string> }) => {
    if (!data || !data.name) return

    if (data.name === activePortfolio) {
      setActivePortfolio("all")
    } else {
      setActivePortfolio(data.name)
    }
  }

  return (
    <Card className={cn("flex flex-col gap-0 pb-0", className)}>
      <CardHeader className="flex items-start space-y-0">
        <div className="grid gap-1">
          <CardTitle>Applications</CardTitle>
          <CardDescription>By portfolio</CardDescription>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="ml-auto w-[150px] justify-between"
            >
              <div className="flex items-center gap-2 text-xs font-normal">
                {activePortfolio === "all" ? (
                  <>
                    <span className="flex h-3 w-3 shrink-0 rounded-sm bg-muted-foreground" />
                    All portfolios
                  </>
                ) : (
                  <>
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: chartConfig[activePortfolio as keyof typeof chartConfig]?.color || "transparent",
                      }}
                    />
                    {chartConfig[activePortfolio as keyof typeof chartConfig]?.label || activePortfolio}
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search portfolio..." />
              <CommandList>
                <CommandEmpty>No portfolio found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setActivePortfolio("all")
                      setOpen(false)
                    }}
                    className="text-xs"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex h-3 w-3 shrink-0 rounded-sm bg-muted-foreground" />
                      All Portfolios
                    </div>
                    <Check className={cn("ml-auto h-4 w-4", activePortfolio === "all" ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                  {portfolios
                    .filter((p) => p !== "all")
                    .map((portfolio) => {
                      const config = chartConfig[portfolio as keyof typeof chartConfig]
                      return (
                        <CommandItem
                          key={portfolio}
                          value={portfolio}
                          onSelect={() => {
                            setActivePortfolio(portfolio)
                            setOpen(false)
                          }}
                          className="text-xs"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className="flex h-3 w-3 shrink-0 rounded-sm"
                              style={{
                                backgroundColor: config?.color || "transparent",
                              }}
                            />
                            {config?.label}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              activePortfolio === portfolio ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      )
                    })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>} />
            <Pie
              data={chartData}
              dataKey="applications"
              nameKey="portfolio"
              innerRadius={60}
              strokeWidth={5}
              paddingAngle={2}
              cornerRadius={2}
              activeIndex={activeIndex !== -1 ? activeIndex : undefined}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                </g>
              )}
              onClick={handlePieClick}
              className="cursor-pointer"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold select-none">
                          {portfolioTotal.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground select-none">
                          Applications
                        </tspan>
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
