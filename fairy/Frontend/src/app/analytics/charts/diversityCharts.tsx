"use client"

import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenderChart } from "./genderChart"
import { IsInternationalChart } from "./isInternationalChart"
import { YearOfStudyChart } from "./yearOfStudyChart"

export function DiversityCharts() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Diversity Statistics</CardTitle>
        <CardDescription>Breakdown of applicant diversity metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gender">
          <TabsList className="w-full">
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
            <TabsTrigger value="year">Year of Study</TabsTrigger>
          </TabsList>
          <TabsContent value="gender">
            <GenderChart />
          </TabsContent>
          <TabsContent value="international">
            <IsInternationalChart />
          </TabsContent>
          <TabsContent value="year">
            <YearOfStudyChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
