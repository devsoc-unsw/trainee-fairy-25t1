"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { date: "2024-04-01", applications: 14 },
  { date: "2024-04-02", applications: 26 },
  { date: "2024-04-03", applications: 34 },
  { date: "2024-04-04", applications: 35 },
  { date: "2024-04-05", applications: 26 },
  { date: "2024-04-06", applications: 25 },
  { date: "2024-04-07", applications: 21 },
  { date: "2024-04-08", applications: 26 },
  { date: "2024-04-09", applications: 13 },
  { date: "2024-04-10", applications: 26 },
  { date: "2024-04-11", applications: 12 },
  { date: "2024-04-12", applications: 10 },
  { date: "2024-04-13", applications: 2 },
  { date: "2024-04-14", applications: 12 },
  { date: "2024-04-15", applications: 11 },
  { date: "2024-04-16", applications: 10 },
  { date: "2024-04-17", applications: 14 },
  { date: "2024-04-18", applications: 12 },
  { date: "2024-04-19", applications: 14 },
  { date: "2024-04-20", applications: 13 },
  { date: "2024-04-21", applications: 12 },
  { date: "2024-04-22", applications: 14 },
  { date: "2024-04-23", applications: 12 },
  { date: "2024-04-24", applications: 18 },
  { date: "2024-04-25", applications: 14 },
  { date: "2024-04-26", applications: 25 },
  { date: "2024-04-27", applications: 64 },
  { date: "2024-04-28", applications: 76 },
  { date: "2024-04-29", applications: 127 },
  { date: "2024-04-30", applications: 163 },
]

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ApplicationsPerDayChart({ className }: { className?: string }) {
  const totalApplications = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applications, 0)
  }, [chartData]);

  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader className="flex items-center">
        <div className="grid gap-1">
          <CardTitle>Recruitment Metrics</CardTitle>
          <CardDescription>
            Total applications per day
          </CardDescription>
        </div>
        <div className="ml-auto flex flex-col items-end">
          <span className="text-muted-foreground text-xs">Applications</span>
          <span className="text-xl @2xl/card:text-2xl font-bold">{totalApplications.toLocaleString()}</span>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-applications)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="applications"
              type="bump"
              fill="url(#fillDesktop)"
              stroke="var(--color-applications)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
