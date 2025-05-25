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
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const data = {
  teams: [
    { name: "CSESoc", logo: Terminal },
    { name: "DevSoc", logo: Code },
    { name: "CompClub", logo: Laptop },
  ],
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Applications", url: "#", icon: FileTextIcon },
    { title: "Interviews", url: "#", icon: Calendar },
    { title: "Applicants", url: "#", icon: UsersIcon },
    { title: "Analytics", url: "/analytics", icon: BarChartIcon },
    { title: "Test", url: "/test", icon: BarChartIcon },
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
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setUser({ name: data.user.user_metadata.first_name + " " + data.user.user_metadata.last_name, email: data.user.email , role: "Director"  });
          console.log(data)
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
      } 
    }

    fetchUser()
  }, [router])

  const handleSignOut = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        credentials: "include",
      })
      if (res.ok) {
        router.push("/auth")
      } else {
        console.error("Failed to logout")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

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
        {user && <NavUser user={user} />}
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
