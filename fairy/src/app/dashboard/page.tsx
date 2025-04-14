import { ApplicationsPerDayChart } from "@/components/charts/chart-applications-per-day"
import { DataTable } from "@/components/table/data-table"

import data from "./data.json"
import { SmallChartApplicantions } from "@/components/charts/small-charts/small-chart-applications"
import { SmallChartApplicationStatus } from "@/components/charts/small-charts/small-chart-status"
import { SmallChartGenderRatio } from "@/components/charts/small-charts/small-chart-gender"

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6">
      <div className="@2xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 lg:px-6">
        <SmallChartApplicantions />
        <SmallChartApplicationStatus />
        <SmallChartGenderRatio className="hidden @5xl/main:block"/>
        <ApplicationsPerDayChart className="hidden @2xl/main:block col-span-full"/>
      </div>
      <DataTable data={data} />
    </div>
  )
}
