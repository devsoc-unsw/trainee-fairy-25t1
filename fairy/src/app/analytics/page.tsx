import { ApplicantsByPortfolio } from "./charts/applicantsByPortfolio";
import { ApplicationStatusChart } from "./charts/applicationStatusChart";
import { DiversityCharts } from "./charts/diversityCharts";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-2 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          This is the analytics page.
        </p>

        <div className="bg-red-50 grid grid-cols-3 gap-4">
          <ApplicantsByPortfolio />
          <DiversityCharts />
          <ApplicationStatusChart />
        </div>
      </div>
    </div>
  );
}