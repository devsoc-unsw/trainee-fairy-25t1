"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { z } from "zod"
import { schema } from "../table/data-table"
import { useIsMobile } from "@/hooks/use-mobile"
import { Application, Question, Questions, dummyData } from "./dummy-data"
import { useState } from "react"
import { CircleAlertIcon, ClipboardIcon, FileTextIcon, FlagIcon, SendIcon, ThumbsUpIcon, UserIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

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
    return <div className="whitespace-pre-wrap text-sm">{answer}</div>
  }

  return <div className="text-sm">{answer}</div>
}

export default function ApplicationViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  
  const { zid, name, email, applications, diversity, recommendations, redFlags, coi } = dummyData;
  const { gender, education, degree, student_type, year } = diversity;
  
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
          
          <TabsContent value="application">
            <ResizablePanelGroup
              direction="horizontal"
            >
              <ResizablePanel defaultSize={75} className="pr-3">
                <ScrollArea className="h-[calc(90vh-180px)]">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Questions</CardTitle>
                        <CardDescription>Common questions for all portfolios</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* map over questions and display correspond answer */}
                        {Questions["general"].map((question: Question, index: number) => (
                          <div key={question.id} className="space-y-1.5">
                            <h4 className="font-medium text-sm">
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
                            <h4 className="font-medium text-sm">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="pl-4 border-l-2 border-muted">
                              {formatAnswer(application.answers.specific[question.id], question.type)}
                            </div>

                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} className="pl-3">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex flex-col space-y-3">
                    <Card className="py-2">
                      <CardContent className="flex h-24 items-center justify-center">
                        <span className="font-semibold">Comment 1</span>
                      </CardContent>
                    </Card>
                    <Card className="py-2">
                      <CardContent className="flex h-24 items-center justify-center">
                        <span className="font-semibold">Comment 2</span>
                      </CardContent>
                    </Card>
                    <Card className="py-2">
                      <CardContent className="flex h-24 items-center justify-center">
                        <span className="font-semibold">Comment 3</span>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardContent className="flex flex-col items-center">
                      <Textarea
                        placeholder="Add your comment..."
                        className="max-w-lg resize-none text-base mb-3"
                        rows={5}
                      />
                      <Button className="w-full max-w-lg">
                        <SendIcon />
                        Add Comment
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="profile">
            <ScrollArea className="h-[calc(90vh-180px)] space-y-4">
              <div className="space-y-4">
                {/* General info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Full name</Label>
                        <p className="text-base font-medium">{name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="text-base font-medium">{email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">zID</Label>
                        <p className="text-base font-medium">{zid}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Degree</Label>
                        <p className="text-base font-medium">{degree}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diversity info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Diversity</CardTitle>
                    <CardDescription>Equity and diversity information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Gender</Label>
                        <p className="text-base font-medium">{gender}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Education</Label>
                        <p className="text-base font-medium">{education}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Student type</Label>
                        <p className="text-base font-medium">{student_type}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">Year of study</Label>
                        <p className="text-base font-medium">{year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            <ScrollArea className="h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Flags</CardTitle>
                    <CardDescription>Recommendations, red flags, and COI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Red Flags */}
                      <div>
                        <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                          <FlagIcon className="h-5 w-5 text-red-500" />
                          Red Flags
                        </h3>
                        {redFlags.length > 0 ? (
                          <div className="space-y-2">
                              {redFlags.map((comment) => (
                                <div key={comment.id} className="bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200 p-3 rounded-md text-base flex flex-col space-y-1">
                                  <span className="font-bold text-sm">{comment.author}</span>
                                  <span>{comment.comment}</span>
                                  {/* <span>{comment.date}</span> */}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-base">No red flags identified.</div>
                        )}
                      </div>

                      {/* Green Flags / Recommendations */}
                      <div>
                        <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                          <ThumbsUpIcon className="h-5 w-5 text-green-500" />
                          Recommendations
                        </h3>
                        {recommendations.length > 0 ? (
                          <div className="space-y-2">
                            {recommendations.map((comment) => (
                              <div key={comment.id} className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200 p-3 rounded-md text-base flex flex-col space-y-1">
                                  <span className="font-bold text-sm">{comment.author}</span>
                                  <span>{comment.comment}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-base">No recommendations yet.</div>
                        )}
                      </div>

                      {/* Conflicts of Interest */}
                      <div>
                        <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                          <CircleAlertIcon className="h-5 w-5 text-yellow-500" />
                          Conflicts of Interest
                        </h3>
                        {coi.length > 0  ? (
                          <div className="space-y-2">
                            {coi.map((comment) => (
                              <div key={comment.id} className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 p-3 rounded-md text-base flex flex-col space-y-1">
                                  <span className="font-bold text-sm">{comment.author}</span>
                                  <span>{comment.comment}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-base">No conflicts of interest declared.</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}