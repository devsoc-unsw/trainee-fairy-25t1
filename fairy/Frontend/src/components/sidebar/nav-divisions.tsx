"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

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
                <a href={`/drives/${drive.id}`}>{drive.name}</a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
