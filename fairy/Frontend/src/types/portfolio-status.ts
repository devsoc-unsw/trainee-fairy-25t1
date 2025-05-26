export interface PortfolioStatus {
  portfolio_id: string
  portfolio_name: string
  accepted: number
  rejected: number
  pending: number
  waitlisted: number
}

export interface ChartStatusData {
  status: string
  applicants: number
  fill: string
}
