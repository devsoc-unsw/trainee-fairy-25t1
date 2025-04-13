"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const allPortfolioData = [
  { status: "accepted", applicants: 457, fill: "var(--color-accepted)" },
  { status: "rejected", applicants: 198, fill: "var(--color-rejected)" },
  { status: "pending", applicants: 226, fill: "var(--color-pending)" },
]

const specificPortfolioData = [
  { status: "accepted", applicants: 46, fill: "var(--color-accepted)" },
  { status: "rejected", applicants: 14, fill: "var(--color-rejected)" },
  { status: "pending", applicants: 18, fill: "var(--color-pending)" },
]

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
    color: "var(--muted)",
  },
} satisfies ChartConfig

export function ApplicationStatusChart() {
  const totalApplicants = React.useMemo(() => {
    return allPortfolioData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, []);
  const totalAccepted = React.useMemo(() => {
    return allPortfolioData.find((data) => data.status === "accepted")?.applicants || 0
  }, []);
  const specificTotalAccepted = React.useMemo(() => {
    return specificPortfolioData.find((data) => data.status === "accepted")?.applicants || 0
  }, []);
  const specificTotalApplicants = React.useMemo(() => {
    return specificPortfolioData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Application Status</CardTitle>
        <CardDescription>Current status of applications</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Tabs defaultValue="specific">
          <TabsList className="w-full">
            <TabsTrigger value="specific">My Portfolio</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value="specific">
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
                  data={specificPortfolioData}
                  dataKey="applicants"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                  paddingAngle={2}
                  cornerRadius={4}
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
                              {specificTotalAccepted.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Accepted
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Acceptance rate: {(specificTotalAccepted / specificTotalApplicants * 100).toFixed(1)}%
              </div>
              <div className="leading-none text-muted-foreground">
                Showing data for your portfolio.
              </div>
            </CardFooter>
          </TabsContent>
          <TabsContent value="all">
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
                  data={allPortfolioData}
                  dataKey="applicants"
                  nameKey="status"
                  innerRadius={60}
                  strokeWidth={5}
                  paddingAngle={2}
                  cornerRadius={4}
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
                              {totalAccepted.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Accepted
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                Acceptance rate: {(totalAccepted / totalApplicants * 100).toFixed(1)}%
              </div>
              <div className="leading-none text-muted-foreground">
                Showing data for all portfolios.
              </div>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
