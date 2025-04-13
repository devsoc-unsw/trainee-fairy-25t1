
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

const rawData = [
  { gender: "male", applicants: 546, fill: "var(--color-male)" },
  { gender: "female", applicants: 319, fill: "var(--color-female)" },
  { gender: "other", applicants: 16, fill: "var(--color-other)" },
]

const rawDataPortfolioSpecific = [
  { gender: "male", applicants: 40, fill: "var(--color-male)" },
  { gender: "female", applicants: 15, fill: "var(--color-female)" },
  { gender: "other", applicants: 0, fill: "var(--color-other)" },
]

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  male: {
    label: "Male",
    color: "oklch(71.5% 0.143 215.221)", // cyan-500
  },
  female: {
    label: "Female",
    color: "oklch(64.5% 0.246 16.439)", // rose-500
  },
  other: {
    label: "Other",
    color: "oklch(60.6% 0.25 292.717)", // violet-500
  },
} satisfies ChartConfig

export function SmallChartGenderRatio({ className }: { className?: string }) {
  const [selectedPortfolio, setSelectedPortfolio] = React.useState("specific");
  const [activeGender, setActiveGender] = React.useState<string | null>(null);

  const chartData = React.useMemo(() => {
    return selectedPortfolio === "specific" ? rawDataPortfolioSpecific : rawData;
  }, [selectedPortfolio]);

  const activeIndex = React.useMemo(() => {
    if (!activeGender) return -1;
    return chartData.findIndex((item) => item.gender === activeGender);
  }, [selectedPortfolio, activeGender]);

  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, [selectedPortfolio]);

  const selectedTotal = React.useMemo(() => {
    // default shows percentage of non-males
    if (!activeGender) {
      return chartData.reduce((total, data) => {
        return data.gender !== "male" ? total + data.applicants : total;
      }, 0);
    }
    return chartData.find((data) => data.gender === activeGender)?.applicants || 0; 
  }, [selectedPortfolio, activeGender]);

  const onClick = (data: { gender: React.SetStateAction<string | null> }) => {
    if (!data || !data.gender) return;

    if (data.gender === activeGender) {
      setActiveGender(null);
    } else {
      setActiveGender(data.gender);
    }
  }

  return (
    <Card className={cn("flex flex-col gap-0 pb-0", className)}>
      <CardHeader className="flex items-start space-y-0 truncate">
        <div className="grid gap-1">
          <CardTitle>Gender ratio</CardTitle>
          <CardDescription>{selectedPortfolio === "specific" ? (
              <span>For your portfolio</span>
            ) : (
              <span>For all portfolios</span>
            )}
          </CardDescription>
        </div>
        <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
          <SelectTrigger className="ml-auto w-[150px] justify-between text-xs font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="specific" className="text-xs font-normal">Competitions</SelectItem>
              <SelectItem value="all" className="text-xs font-normal">All Portfolios</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="applicants"
              nameKey="gender"
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
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {(selectedTotal / totalApplicants * 100).toFixed(1)}%
                        </tspan>
                        {!activeGender ? (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Non-male
                          </tspan>
                        ) : (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground capitalize"
                          >
                            {activeGender}
                          </tspan>)
                        }
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
