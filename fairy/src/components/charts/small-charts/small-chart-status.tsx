
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

const rawData = [
  { status: "accepted", applicants: 457, fill: "var(--color-accepted)" },
  { status: "rejected", applicants: 198, fill: "var(--color-rejected)" },
  { status: "pending", applicants: 226, fill: "var(--color-pending)" },
];

const rawDataPortfolioSpecific = [
  { status: "accepted", applicants: 46, fill: "var(--color-accepted)" },
  { status: "rejected", applicants: 14, fill: "var(--color-rejected)" },
  { status: "pending", applicants: 18, fill: "var(--color-pending)" },
];

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
} satisfies ChartConfig;

export function SmallChartApplicationStatus({ className }: { className?: string }) {
  const [selectedPortfolio, setSelectedPortfolio] = React.useState("specific");
  const [activeStatus, setActiveStatus] = React.useState<string>("pending");

  const chartData = React.useMemo(() => {
    return selectedPortfolio === "specific" ? rawDataPortfolioSpecific : rawData;
  }, [selectedPortfolio]);

  const activeIndex = React.useMemo(() => {
    if (!activeStatus) return -1;
    return chartData.findIndex((item) => item.status === activeStatus);
  }, [selectedPortfolio, activeStatus]);

  const selectedTotal = React.useMemo(() => {
    return chartData.find((data) => data.status === activeStatus)?.applicants || 0; 
  }, [selectedPortfolio, activeStatus]);

  const onClick = (data: { status: React.SetStateAction<string> }) => {
    if (!data || !data.status) return;

    setActiveStatus(data.status);
  }

  return (
    <Card className={cn("flex flex-col gap-0 pb-0", className)}>
      <CardHeader className="flex items-start space-y-0 truncate">
        <div className="grid gap-1">
          <CardTitle>Statuses</CardTitle>
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
                          {selectedTotal}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          {/* using js to capitalise cos tailwind class doesn't work for some reason */}
                          {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}
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
