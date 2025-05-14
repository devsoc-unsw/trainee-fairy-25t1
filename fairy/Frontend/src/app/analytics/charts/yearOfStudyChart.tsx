
"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { yearOfStudy: "first", applicants: 275, fill: "var(--color-first)" },
  { yearOfStudy: "second", applicants: 287, fill: "var(--color-second)" },
  { yearOfStudy: "third", applicants: 200, fill: "var(--color-third)" },
  { yearOfStudy: "fourth", applicants: 109, fill: "var(--color-fourth)" },
  { yearOfStudy: "other", applicants: 10, fill: "var(--color-other)" },
]

const chartConfig = {
  applicants: {
    label: "applicants",
  },
  first: {
    label: "1st Year",
    color: "var(--chart-1)",
  },
  second: {
    label: "2nd Year",
    color: "var(--chart-2)",
  },
  third: {
    label: "3rd Year",
    color: "var(--chart-3)",
  },
  fourth: {
    label: "4th Year",
    color: "var(--chart-4)",
  },
  other: {
    label: "5th Year+",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function YearOfStudyChart() {
  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, []);

  const totalFirstYears = React.useMemo(() => {
    return chartData.find((data) => data.yearOfStudy === "first")?.applicants || 0
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="applicants"
          nameKey="yearOfStudy"
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
                      {(totalFirstYears / totalApplicants * 100).toFixed(1)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      First Years
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="yearOfStudy" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
