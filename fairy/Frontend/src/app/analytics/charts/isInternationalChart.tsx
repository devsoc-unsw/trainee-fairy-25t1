
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
  { type: "domestic", applicants: 846, fill: "var(--color-domestic)" },
  { type: "international", applicants: 35, fill: "var(--color-international)" },
]

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  domestic: {
    label: "Domestic",
    color: "var(--chart-1)",
  },
  international: {
    label: "International",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function IsInternationalChart() {
  const totalApplicants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.applicants, 0)
  }, []);

  const totalDomestic = React.useMemo(() => {
    return chartData.find((data) => data.type === "domestic")?.applicants || 0
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
          nameKey="type"
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
                      {(totalDomestic / totalApplicants * 100).toFixed(1)}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Internationals
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="type" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
