"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const data = [
  { day: "Mon", sales: Math.floor(Math.random() * 2000) + 1000 },
  { day: "Tue", sales: Math.floor(Math.random() * 2000) + 1000 },
  { day: "Wed", sales: Math.floor(Math.random() * 2000) + 1000 },
  { day: "Thu", sales: Math.floor(Math.random() * 2000) + 1000 },
  { day: "Fri", sales: Math.floor(Math.random() * 2000) + 1000 },
  { day: "Sat", sales: Math.floor(Math.random() * 3000) + 1500 },
  { day: "Sun", sales: Math.floor(Math.random() * 3000) + 1500 },
]

export function SalesChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>A look at this week's sales revenue.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
