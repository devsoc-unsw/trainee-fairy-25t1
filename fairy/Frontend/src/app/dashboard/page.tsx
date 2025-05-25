"use client"
import { ApplicationsPerDayChart } from "@/components/charts/chart-applications-per-day"

import { SmallChartApplicantions } from "@/components/charts/small-charts/small-chart-applications"
import { SmallChartApplicationStatus } from "@/components/charts/small-charts/small-chart-status"
import { SmallChartGenderRatio } from "@/components/charts/small-charts/small-chart-gender"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApplicationsTable } from "@/components/table/applications-table"

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:3000/dashboard/protected/dashboard", {
          credentials: "include", // Important to send cookies
        });

        if (res.status === 401) {
          console.log(res)
          // Not authenticated, redirect to login page
          router.push("/auth");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await res.json();

        console.log(data)
        const userEmail = data.user?.email;
        // const userDisplayName = data.user?.user_metadata?.display_name || userEmail;
        // setDisplayName(userDisplayName);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6">
      <div className="@2xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 lg:px-6">
        <SmallChartApplicantions />
        <SmallChartApplicationStatus />
        <SmallChartGenderRatio className="hidden @5xl/main:block"/>
        <ApplicationsPerDayChart className="hidden @2xl/main:block col-span-full"/>
      </div>
      <ApplicationsTable/>
    </div>
  )
}
