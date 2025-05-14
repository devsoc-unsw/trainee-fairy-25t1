"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import { z } from "zod"
import { schema } from "../table/data-table"
import { useIsMobile } from "@/hooks/use-mobile"
import { Application, Feedback, Flag, Question, Questions, dummyData } from "./dummy-data"
import { useState } from "react"
import { CircleAlertIcon, ClipboardIcon, FileTextIcon, FlagIcon, SendIcon, ThumbsUpIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"

/* ----------------------- UTIL FUNCTIONS (MOVE LATER) ---------------------- */
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

function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    // Only one name: first two letters
    return parts[0].slice(0, 2).toUpperCase();
  } else {
    // Two or more names: first letter of first + first letter of last
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    return (first + last).toUpperCase();
  }
}

/* -------------------------------------------------------------------------- */

/* ------------------------------- COMPONENTS ------------------------------- */
const FeedbackBlock = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">{getInitials(feedback.author)}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{feedback.author}</span>
        <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
      </div>
      <p className="text-sm">{feedback.comment}</p>
    </div>
  )
}

// TODO: this one Feedback (above) are essentially the same thing
const FlagBlock = ({ flag }: { flag: Flag }) => {
  return (
    <>
      {flag.type === "green" ? (
        <div className="bg-green-50 text-green-800 dark:bg-green-900/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{getInitials(flag.author)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{flag.author}</span>
            <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
          </div>
          <p className="text-sm">{flag.comment}</p>
        </div>
      ) : (
        <div className="bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{getInitials(flag.author)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{flag.author}</span>
            <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
          </div>
          <p className="text-sm">{flag.comment}</p>
        </div>
      )}
    </>
  )
}
/* -------------------------------------------------------------------------- */

export default function ApplicationViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  
  const { zid, name, email, applications, diversity, flags } = dummyData;
  const { gender, education, degree, student_type, year } = diversity;
  const [application, setApplication] = useState<Application>(applications[0]);

  const onViewSwitch = (value: string) => {
    const portfolioName = getApplicationFromPortfolioName(value)
    setApplication(portfolioName)

    // TODO: replace with actual API call
    // TODO: also create loading state for entire modal
    const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: application.portfolio === "education" ? "Marketing" : "Education "}), 1000));

    toast.promise(promise, {
      loading: 'Switching...',
      success: (data) => {
        return `Now viewing ${(data as { name: string }).name} application`;
      },
      error: 'Error',
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {item.header}
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-2 min-w-full sm:min-w-[640px] md:min-w-[768px] lg:min-w-[1024px] xl:min-w-[1280px] 2xl:min-w-[1536px]">
        <DialogHeader className="bg flex flex-row justify-between items-center">
          <div className="flex flex-col justify-start space-y-2">
            <DialogTitle className="text-2xl">{name}</DialogTitle>
            <div className="flex space-x-2">
              <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColour(application.status)} capitalize`}>
                {application.status}
              </Badge>
              <Badge variant="secondary" className={`px-3 py-1 text-sm font-medium ${!application.score && "opacity-50"}`}>
                <span>Score: {application.score ?? "-"} / 100</span>
              </Badge>
            </div>
          </div>
          {applications.length > 1 && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="portfolio-selector" className="text-xs text-muted-foreground">
                Viewing Application For
              </Label>
              <Select value={application.portfolio} onValueChange={(value) => onViewSwitch(value)}>
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

        <Tabs defaultValue="application" className="max-w-full overflow-hidden">
          <TabsList className="w-full">
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
          
          <TabsContent value="application">
            <ResizablePanelGroup
              direction="horizontal"
            >
              <ResizablePanel defaultSize={67} minSize={40} className="pr-3 h-[calc(90vh-180px)]">
                <Card className="h-full">
                  <CardContent className="h-full px-3">
                    <ScrollArea className="h-full">
                      <div className="px-3 space-y-3">
                        <div className="space-y-1">
                          <h3 className="leading-none font-semibold">General Questions</h3>
                          <p className="text-muted-foreground text-sm">Common questions for all portfolios</p>
                        </div>
                        <div className="space-y-6">
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
                        </div>
                        <Separator className="my-8"/>
                        <div className="space-y-1">
                          <h3 className="leading-none font-semibold capitalize">{application.portfolio} Questions</h3>
                          <p className="text-muted-foreground text-sm">Portfolio-specific questions</p>
                        </div>
                        <div className="space-y-6">
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
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={33} minSize={20} className="pl-3 h-[calc(90vh-180px)] grid grid-cols-1 grid-rows-3 space-y-2">
                <Card className="row-span-2">
                  <CardContent className="h-full px-2">
                    <ScrollArea className="h-full">
                      <div className="px-3 space-y-4">
                        <h3 className="leading-none font-semibold">Director Comments</h3>
                        {application.feedback.length === 0 ? (
                          <div className="text-muted-foreground text-sm">No comments yet.</div>
                        ) : (
                          <div className="space-y-2">
                            {application.feedback.map((feedback) => (
                              <FeedbackBlock key={feedback.id} feedback={feedback} />
                            ))}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card className="row-span-1 p-0">
                  <CardContent className="h-full flex flex-col p-3">
                    <div className="flex-1 min-h-0 mb-3">
                      <Textarea
                        placeholder="Add your comment..."
                        className="bg-input/30 h-full min-h-full max-w-full resize-none border-none shadow-none overflow-auto break-words "
                      />
                    </div>
                    <Button className="w-full">
                      <SendIcon />
                      Add Feedback
                    </Button>
                  </CardContent>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="profile">
            <ScrollArea className="h-[calc(90vh-180px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

          <TabsContent value="review">
            <ScrollArea className="h-[calc(90vh-180px)]">
              {/* Flags:
                TODO:
                  - refactor this to reduce code repetition
                  - also make sure looks good when flags.length === 0
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FlagIcon className="h-5 w-5 text-green-500" />
                      <span>Green Flags</span>
                    </CardTitle>
                    <CardContent className="px-0 space-y-2">
                      {flags.filter(flag => flag.type === "green").length <= 0 ? (
                        <div className="text-muted-foreground text-sm">No comments yet.</div>
                      ) : (
                        <>
                          {flags.filter(flag => flag.type === "green").map((flag) => {
                            return (
                              <div key={flag.id} className="space-y-1">
                                <FlagBlock flag={flag as Flag} />
                              </div>
                            )
                          })}
                        </>
                      )}
                    </CardContent>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FlagIcon className="h-5 w-5 text-red-500" />
                      <span>Red Flags</span>
                    </CardTitle>
                    <CardContent className="px-0 space-y-2">
                      {flags.filter(flag => flag.type === "red").length <= 0 ? (
                        <div className="text-muted-foreground text-sm">No comments yet.</div>
                      ) : (
                        <>
                          {flags.filter(flag => flag.type === "red").map((flag) => {
                            return (
                              <div key={flag.id} className="space-y-1">
                                <FlagBlock flag={flag as Flag} />
                              </div>
                            )
                          })}
                        </>
                      )}
                    </CardContent>
                  </CardHeader>
                </Card>

                {/* Other portfolios */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Other Portfolios
                      <Badge variant="secondary" className="ml-2">
                        {applications.length}
                      </Badge>
                    </CardTitle>
                    <CardContent>
                      <div className="space-y-2">
                        {applications.map((app) => (
                          <div key={app.portfolio} className="flex items-center space-x-3">
                            <span className="text-base font-medium capitalize">{app.portfolio}:</span>
                            <Badge variant="outline" className={`px-3 py-1 text-sm font-medium border-none ${getStatusColour(app.status)}`}>
                              {app.status}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                              <span>Score: {app.score ?? "-"} / 100</span>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              </div>

              {/* TODO: add section for application  */}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}