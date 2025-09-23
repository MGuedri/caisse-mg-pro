
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "Jan", sales: 1860 },
    { month: "Fev", sales: 3050 },
    { month: "Mar", sales: 2370 },
    { month: "Avr", sales: 730 },
    { month: "Mai", sales: 2090 },
    { month: "Juin", sales: 2140 },
    { month: "Juil", sales: 2500 },
    { month: "Aout", sales: 1900 },
    { month: "Sep", sales: 2800 },
    { month: "Oct", sales: 2200 },
    { month: "Nov", sales: 3100 },
    { month: "Dec", sales: 3500 },
]

const chartConfig = {
  sales: {
    label: "Ventes",
    color: "hsl(var(--primary))",
  },
}

export function MonthlySalesChart() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Ventes Mensuelles</CardTitle>
        <CardDescription className="text-gray-400">Total des ventes pour chaque mois</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-700"/>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              className="fill-gray-400 text-xs"
            />
             <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
             />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelClassName="text-white font-bold bg-gray-900"
                className="bg-gray-900/80 border-gray-700 backdrop-blur-sm"
              />}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
