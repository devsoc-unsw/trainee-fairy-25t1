"use client"

import * as React from "react"
import {
  BarChartIcon,
  BriefcaseIcon,
  BuildingIcon,
  Calendar,
  CameraIcon,
  ClipboardListIcon,
  Code,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  Laptop,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  Terminal,
  UsersIcon,
  Wrench,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavDivisions } from "./nav-divisions"

const data = {
  user: {
    name: "Lebron James",
    role: "Competitions Director",
    email: "m@example.com",
  },
  teams: [
    {
      name: "CSESoc",
      logo: Terminal,
    },
    {
      name: "DevSoc",
      logo: Code,
    },
    {
      name: "CompClub",
      logo: Laptop,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Applications",
      url: "#",
      icon: FileTextIcon,
    },
    {
      title: "Interviews",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Applicants",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
  ],
  divisions: [
    {
      name: "Internals",
      icon: BuildingIcon,
      portfolios: [
        {
          name: "Creative",
          url: "#",
        },
        {
          name: "Human Resources",
          url: "#",
        },
        {
          name: "Marketing",
          url: "#",
        },
        {
          name: "Media",
          url: "#",
        },
      ],
    },
    {
      name: "Externals",
      icon: BriefcaseIcon,
      portfolios: [
        {
          name: "Careers",
          url: "#",
        },
        {
          name: "Events",
          url: "#",
        },
        {
          name: "Outreach",
          url: "#",
        },
        {
          name: "Socials",
          url: "#",
        },
      ],
    },
    {
      name: "Technical",
      icon: Wrench,
      portfolios: [
        {
          name: "Competitions",
          url: "#",
        },
        {
          name: "Digital",
          url: "#",
          isActive: true, // TODO: change this to portfolio of logged in director
        },
        {
          name: "Education",
          url: "#",
        },
        {
          name: "IT",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams}/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDivisions divisions={data.divisions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
