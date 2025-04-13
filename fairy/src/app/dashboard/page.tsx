import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/table/data-table"

import data from "./data.json"
import { SmallChartApplicants } from "@/components/charts/small-charts/small-chart-applicants"
import { SmallChartApplicationStatus } from "@/components/charts/small-charts/small-chart-status"
import { SmallChartGenderRatio } from "@/components/charts/small-charts/small-chart-gender"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="@2xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 lg:px-6">
        <SmallChartApplicants />
        <SmallChartApplicationStatus />
        <SmallChartGenderRatio className="hidden @5xl/main:block"/>
      </div>
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
