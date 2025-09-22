import { orders } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentOrders() {
  const recentOrders = orders.slice(0, 5)

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Here are the 5 most recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">{order.date}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === "Completed" ? "default" : "secondary"}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
