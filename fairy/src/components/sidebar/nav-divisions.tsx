"use client"
import { ChevronDownIcon, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface Portfolio {
  name: string
  url: string
  isActive?: boolean
}

interface Division {
  name: string
  icon: LucideIcon
  portfolios: Portfolio[]
}

export function NavDivisions({
  divisions,
}: {
  divisions: Division[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Divisions & Portfolios</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {divisions.map((division) => (
            <Collapsible key={division.name} defaultOpen={division.portfolios.some((p) => p.isActive)}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="group/collapsible">
                    <division.icon className="h-4 w-4" />
                    <span>{division.name}</span>
                    <ChevronDownIcon className="ml-auto h-4 w-4 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {division.portfolios.map((portfolio) => (
                      <SidebarMenuSubItem key={portfolio.name}>
                        <SidebarMenuSubButton asChild isActive={portfolio.isActive}>
                          <a href={portfolio.url}>{portfolio.name}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

