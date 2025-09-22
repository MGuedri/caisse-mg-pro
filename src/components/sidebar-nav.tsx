"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Package, Users, FileText, Settings, UtensilsCrossed } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "Point of Sale", icon: ShoppingCart },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary-foreground group-data-[collapsible=icon]:hidden">Caisse MG Pro</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings" legacyBehavior passHref>
                <SidebarMenuButton 
                  isActive={pathname === "/settings"}
                  tooltip={{ children: "Settings" }}
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
