export interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  portfolio: string
  status: "pending" | "accepted" | "rejected" | "waitlisted"
}

export interface ApplicationQuestion {
  question_id: string
  question_label: string
  answer_id: string
  answer: string
  order_index: number
}

export interface ApplicationDetails {
  applicant: Application
  questions: ApplicationQuestion[]
}

export interface ApplicationsResponse {
  applications: Application[]
}

export interface TableState {
  pageIndex: number
  pageSize: number
  sorting: Array<{
    id: string
    desc: boolean
  }>
  globalFilter: string
  driveId?: string
}
