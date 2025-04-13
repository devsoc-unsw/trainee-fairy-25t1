import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Total Revenue</CardDescription>
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs font-bold tracking-tight">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tracking-tight">$1,250.00</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>New Customers</CardDescription>
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs font-bold tracking-tight">
              <TrendingDownIcon />
              -20%
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tracking-tight">1,234</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Active Accounts</CardDescription>
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs font-bold tracking-tight">
              <TrendingUpIcon />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tracking-tight">45,678</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>Growth Rate</CardDescription>
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs font-bold tracking-tight">
              <TrendingUpIcon />
              +4.5%
            </Badge>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tracking-tight">4.5%</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}

