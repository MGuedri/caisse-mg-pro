import { DollarSign, CreditCard, Users, ShoppingBag } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Here's a look at your business today." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={DollarSign} 
          description="+20.1% from last month" 
        />
        <StatCard 
          title="Today's Revenue" 
          value="$1,231.12" 
          icon={DollarSign} 
          description="+180.1% from yesterday" 
        />
        <StatCard 
          title="Total Orders" 
          value="+12,234" 
          icon={ShoppingBag} 
          description="+19% from last month" 
        />
        <StatCard 
          title="New Customers" 
          value="+573" 
          icon={Users} 
          description="+201 since last week" 
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <SalesChart />
        <RecentOrders />
      </div>
    </>
  )
}
