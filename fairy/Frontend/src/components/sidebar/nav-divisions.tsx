"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

interface Drive {
  id: string
  name: string
  isActive?: boolean
}

export function NavDrives({
  drives,
}: {
  drives: Drive[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Drives</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {drives.map((drive) => (
            <SidebarMenuSubItem key={drive.id}>
              <SidebarMenuSubButton asChild isActive={drive.isActive}>
                <Link href={{
                  pathname: "/dashboard",
                  query: { drive_id: drive.id },
                }}
                >
                  <span className="flex items-center">
                    <span className="truncate">{drive.name}</span>
                  </span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
