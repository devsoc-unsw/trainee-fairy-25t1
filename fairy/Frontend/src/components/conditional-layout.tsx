"use client"

import type React from "react"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Routes where the sidebar should be displayed
  const showSidebarRoutes = ["/dashboard", "/analytics", "/applications"];

  // Map routes to their display names
  const routeNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/analytics": "Analytics",
    "/applications": "Applications",
  };

  // Get the current page name based on the pathname
  const getCurrentPageName = () => routeNames[pathname] ?? "Page";

  // Check if the current path starts with any of the routes where sidebar should be shown
  const shouldShowSidebar = showSidebarRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!shouldShowSidebar) {
    return <>{children}</>
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <h1 className="font-semibold">{getCurrentPageName()}</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col container mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
