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
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CSESoc",
      logo: Terminal,
      plan: "Enterprise",
    },
    {
      name: "DevSoc",
      logo: Code,
      plan: "Startup",
    },
    {
      name: "CompClub",
      logo: Laptop,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
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
      url: "#",
      icon: BarChartIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
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
