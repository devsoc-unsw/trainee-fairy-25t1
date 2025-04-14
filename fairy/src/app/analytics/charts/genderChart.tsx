
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
  { gender: "male", applicants: 546, fill: "var(--color-male)" },
  { gender: "female", applicants: 319, fill: "var(--color-female)" },
  { gender: "other", applicants: 16, fill: "var(--color-other)" },
]

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  male: {
    label: "Male",
    color: "oklch(68.5% 0.169 237.323)", // sky-500
  },
  female: {
    label: "Female",
    color: "oklch(64.5% 0.246 16.439)", // rose-500
  },
  other: {
    label: "Other",
    color: "oklch(76.9% 0.188 70.08)", // amber-500
  },
} satisfies ChartConfig

export function GenderChart() {
  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, []);

  const nonMales = React.useMemo(() => {
    return chartData.find((data) => data.gender !== "male")?.applicants || 0
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
          nameKey="gender"
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
                      {(nonMales / totalApplicants * 100).toFixed(1)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Non-male
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="gender" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
