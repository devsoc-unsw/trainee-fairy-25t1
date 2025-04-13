"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { date: "2024-04-01", applications: 222 },
  { date: "2024-04-02", applications: 97 },
  { date: "2024-04-03", applications: 167 },
  { date: "2024-04-04", applications: 242 },
  { date: "2024-04-05", applications: 373 },
  { date: "2024-04-06", applications: 301 },
  { date: "2024-04-07", applications: 245 },
  { date: "2024-04-08", applications: 409 },
  { date: "2024-04-09", applications: 59 },
  { date: "2024-04-10", applications: 261 },
  { date: "2024-04-11", applications: 327 },
  { date: "2024-04-12", applications: 292 },
  { date: "2024-04-13", applications: 342 },
  { date: "2024-04-14", applications: 137 },
  { date: "2024-04-15", applications: 120 },
  { date: "2024-04-16", applications: 138 },
  { date: "2024-04-17", applications: 446 },
  { date: "2024-04-18", applications: 364 },
  { date: "2024-04-19", applications: 243 },
  { date: "2024-04-20", applications: 89 },
  { date: "2024-04-21", applications: 137 },
  { date: "2024-04-22", applications: 224 },
  { date: "2024-04-23", applications: 138 },
  { date: "2024-04-24", applications: 387 },
  { date: "2024-04-25", applications: 215 },
  { date: "2024-04-26", applications: 75 },
  { date: "2024-04-27", applications: 383 },
  { date: "2024-04-28", applications: 122 },
  { date: "2024-04-29", applications: 315 },
  { date: "2024-04-30", applications: 454 },
  { date: "2024-05-01", applications: 165 },
  { date: "2024-05-02", applications: 293 },
  { date: "2024-05-03", applications: 247 },
  { date: "2024-05-04", applications: 385 },
  { date: "2024-05-05", applications: 481 },
  { date: "2024-05-06", applications: 498 },
  { date: "2024-05-07", applications: 388 },
  { date: "2024-05-08", applications: 149 },
  { date: "2024-05-09", applications: 227 },
  { date: "2024-05-10", applications: 293 },
  { date: "2024-05-11", applications: 335 },
  { date: "2024-05-12", applications: 197 },
  { date: "2024-05-13", applications: 197 },
  { date: "2024-05-14", applications: 448 },
  { date: "2024-05-15", applications: 473 },
  { date: "2024-05-16", applications: 338 },
  { date: "2024-05-17", applications: 499 },
  { date: "2024-05-18", applications: 315 },
  { date: "2024-05-19", applications: 235 },
  { date: "2024-05-20", applications: 177 },
  { date: "2024-05-21", applications: 82 },
  { date: "2024-05-22", applications: 81 },
  { date: "2024-05-23", applications: 252 },
  { date: "2024-05-24", applications: 294 },
  { date: "2024-05-25", applications: 201 },
  { date: "2024-05-26", applications: 213 },
  { date: "2024-05-27", applications: 420 },
  { date: "2024-05-28", applications: 233 },
  { date: "2024-05-29", applications: 78 },
  { date: "2024-05-30", applications: 340 },
  { date: "2024-05-31", applications: 178 },
]

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ApplicationsPerDayChart() {
  const totalApplications = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applications, 0)
  }, [chartData]);

  return (
    <Card className="@container/card">
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
              type="natural"
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
