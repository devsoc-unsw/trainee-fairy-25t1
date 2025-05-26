export interface Application {
  id: string
  first_name: string
  last_name: string
  email: string
  portfolio: string
  status: string
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
  driveId: string
}
