"use client"

import * as React from "react"
import {
  BarChartIcon,
  BriefcaseIcon,
  BuildingIcon,
  Calendar,
  Code,
  FileTextIcon,
  LayoutDashboardIcon,
  Laptop,
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
import { Button } from "@/components/ui/button" // Make sure you import your button component

import { useRouter } from "next/navigation";

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
        { name: "Creative", url: "#" },
        { name: "Human Resources", url: "#" },
        { name: "Marketing", url: "#" },
        { name: "Media", url: "#" },
      ],
    },
    {
      name: "Externals",
      icon: BriefcaseIcon,
      portfolios: [
        { name: "Careers", url: "#" },
        { name: "Events", url: "#" },
        { name: "Outreach", url: "#" },
        { name: "Socials", url: "#" },
      ],
    },
    {
      name: "Technical",
      icon: Wrench,
      portfolios: [
        { name: "Competitions", url: "#" },
        { name: "Digital", url: "#", isActive: true },
        { name: "Education", url: "#" },
        { name: "IT", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        credentials: "include",
      });

      if (res.ok) {
        router.push("/auth");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDivisions divisions={data.divisions} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <NavUser user={data.user} />
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
