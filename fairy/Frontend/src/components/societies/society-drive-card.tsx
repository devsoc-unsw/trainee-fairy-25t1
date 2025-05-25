
import { Drive } from "@/app/recruiting/page";
import Link from "next/link";

import { Calendar, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Props {
  drive: Drive;
  href: string;
}

const DriveCard: React.FC<Props> = ({ drive, href }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const isOpen = () => {
    const now = new Date()
    const openDate = new Date(drive.open_date)
    const closeDate = new Date(drive.close_date)
    return now >= openDate && now <= closeDate
  }

  return (
    <Link href={{
      pathname: `${href}`,
      query: { society_id: drive.s_id, drive_id: drive.d_id }
    }}>
      <Card className="w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
            <img
              src={drive.img_url || "/placeholder.svg"}
              alt={`${drive.alias} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">{drive.s_name}</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
              {drive.alias}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-900 group-hover:text-blue-500 transition-color duration-300">
              <Users className="w-5 h-5" />
              <h1 className="text-xl font-bold leading-tight ">{drive.d_name}</h1>
            </div>
            <Badge
              variant={isOpen() ? "default" : "secondary"}
              className={`${isOpen() ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"} text-white font-medium`}
            >
              {isOpen() ? "Applications Open" : "Applications Closed"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Opens</p>
                <p className="text-sm text-gray-600">{formatDate(drive.open_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <Calendar className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Closes</p>
                <p className="text-sm text-gray-600">{formatDate(drive.close_date)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};


export default DriveCard;