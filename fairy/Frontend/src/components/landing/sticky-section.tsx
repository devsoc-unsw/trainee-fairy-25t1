import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface StickySectionProps {
  backgroundColour?: string
  pageColour?: string
  height?: string
  children: ReactNode
  id?: string
}

export default function StickySection({
  backgroundColour = "bg-foreground",
  pageColour = "bg-background",
  height = "600px",
  children,
  id,
}: StickySectionProps) {
  return (
    <div id={id} className={cn(pageColour)}>
      <div
        className={cn("relative rounded-b-4xl", backgroundColour)}
        style={{
          clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
          height: height,
        }}
      >
        <div className="relative -top-[100vh]" style={{ height: `calc(100vh + ${height})` }}>
          <div
            className="sticky"
            style={{
              height: height,
              top: `calc(100vh - ${height})`,
            }}
          >
            <div className="mx-auto container py-8 px-12 h-full w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

