import { AppProvider } from "@/app/(app)/app-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppProvider>
      <main>
        {children}
      </main>
    </AppProvider>
  )
}
