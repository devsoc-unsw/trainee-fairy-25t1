"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { z } from "zod"
import { schema } from "../table/data-table"
import { useIsMobile } from "@/hooks/use-mobile"
import { Application, Question, Questions, dummyData } from "./dummy-data"
import { useState } from "react"
import { ClipboardIcon, FileTextIcon, UserIcon } from "lucide-react"

const getStatusColour = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
}

const getApplicationFromPortfolioName = (portfolioName: string): Application => {
  const application = dummyData.applications.find(app => app.portfolio === portfolioName);
  return application as Application;
}

// Function to format answers based on question type
function formatAnswer(answer: string | string[], type: string) {
  if (type === "multipleChoice" && Array.isArray(answer)) {
    return (
      <div className="flex flex-wrap gap-1">
        {answer.map((item, index) => (
          <Badge key={index} variant="outline" className="px-2 py-1">
            {item}
          </Badge>
        ))}
      </div>
    )
  }

  if (type === "longText") {
    return <div className="whitespace-pre-wrap">{answer}</div>
  }

  return <div>{answer}</div>
}

export default function ApplicationViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  
  const { zid, name, email, applications, diversity, recommendations, redFlags, coi } = dummyData;
  const { gender, education, student_type, year } = diversity;
  
  const [application, setApplication] = useState<Application>(applications[0]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DialogTrigger>
      {/* TODO: figure out why width sizing is so weird, NEED TO SET MAX-W */}
      <DialogContent className="min-w-3/5">
        <DialogHeader className="sticky top-0 z-10 flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start space-y-2">
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <div className="flex space-x-2">
              <Badge className={`${getStatusColour(application.status)} capitalize`}>
                {application.status}
              </Badge>
              <Badge variant="secondary">
                Score: {application.score ?? "-"}
              </Badge>
            </div>
          </div>
          {applications.length > 1 && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="portfolio-selector" className="text-xs text-muted-foreground">
                  Viewing Application For
                </Label>
                <Select value={application.portfolio} onValueChange={(value) => {setApplication(getApplicationFromPortfolioName(value))}}>
                  <SelectTrigger id="portfolio-selector" className="w-[200px]">
                    <SelectValue placeholder="Select portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.map((app) => (
                      <SelectItem key={app.portfolio} value={app.portfolio}>
                        <span className="capitalize">{app.portfolio}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
        </DialogHeader>

        <Tabs defaultValue="application" className="w-full">
          <div className="sticky top-[105px] z-10 bg-background">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="application" className="flex gap-2">
                <FileTextIcon />
                <span>Application</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex gap-2">
                <UserIcon />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex gap-2">
                <ClipboardIcon />
                <span>Review</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(80vh-180px)]">
            <TabsContent value="application" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>General Questions</CardTitle>
                  <CardDescription>Common questions for all portfolios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* map over questions and display correspond answer */}
                  {Questions["general"].map((question: Question, index: number) => (
                    <div key={question.id} className="space-y-1.5">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="pl-4 border-l-2 border-muted">
                        {formatAnswer(application.answers.general[question.id], question.type)}
                      </div>

                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{application.portfolio} Questions</CardTitle>
                  <CardDescription>Portfolio-specific questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* map over questions and display correspond answer */}
                  {Questions[application.portfolio].map((question: Question, index: number) => (
                    <div key={question.id} className="space-y-1.5">
                      <h4 className="font-medium">
                        {index + 1}. {question.question}
                      </h4>
                      <div className="pl-4 border-l-2 border-muted">
                        {formatAnswer(application.answers.specific[question.id], question.type)}
                      </div>

                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile">
              <Card>
                <CardContent>
                  
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="review">

            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}