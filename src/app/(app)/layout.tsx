import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
