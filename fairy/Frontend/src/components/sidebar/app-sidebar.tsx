"use client"

import * as React from "react"
import {
  BarChartIcon,
  FileTextIcon,
  Calendar,
  LayoutDashboardIcon,
  Terminal,
  UsersIcon,
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
import { NavDrives } from "./nav-divisions"
import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
    { title: "Applications", url: "#", icon: FileTextIcon },
    { title: "Interviews", url: "#", icon: Calendar },
    { title: "Applicants", url: "#", icon: UsersIcon },
    { title: "Analytics", url: "/analytics", icon: BarChartIcon },
    { title: "Test", url: "/test", icon: BarChartIcon },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [societies, setSocieties] = useState<
    { id: string; name: string; user_role: string; drives: any[] }[]
  >([])

  const [activeSociety, setActiveSociety] = useState<
    { id: string; name: string; user_role: string; drives: any[] } | null
  >(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          credentials: "include",
        })

        if (res.ok) {
          const data = await res.json()
          console.log(data)

          setUser({
            name: `${data.user.user_metadata.first_name} ${data.user.user_metadata.last_name}`,
            email: data.user.email,
            role: "", // will update below
          })

          setSocieties(data.societies)

          // Set first society active by default
          if (data.societies.length > 0) {
            setActiveSociety(data.societies[0])
            setUser((u) => (u ? { ...u, role: data.societies[0].user_role } : null))
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err)
      }
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    if (activeSociety) {
      setUser((u) => (u ? { ...u, role: activeSociety.user_role } : null))
    }
  }, [activeSociety])

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

  const teamsForSwitcher = societies.map((soc) => ({
    name: soc.name,
    logo: Terminal,
  }))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {societies.length > 0 && activeSociety && (
          <TeamSwitcher
            teams={teamsForSwitcher}
            activeTeam={{ name: activeSociety.name, logo: Terminal }}
            onChange={(team) => {
              const selected = societies.find((soc) => soc.name === team.name)
              if (selected) setActiveSociety(selected)
            }}
          />
        )}
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {activeSociety && (
          <>
            <NavDrives drives={activeSociety.drives} />
            <div className="px-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() =>
                  router.push(`/societies/${activeSociety.id}/drives/new`)
                }
              >
                + New Drive
              </Button>
            </div>
          </>
        )}
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
