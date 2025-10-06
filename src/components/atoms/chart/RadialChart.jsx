"use client"

import React, { useState } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Generate dummy data for 68 days
const generateData = (count) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
  return Array.from({ length: count }, (_, i) => ({
    month: months[i % months.length] + ` ${i + 1}`,
    desktop: Math.floor(Math.random() * 300) + 50,
    mobile: Math.floor(Math.random() * 200) + 30,
  }))
}

const allData = generateData(18)

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
}

const RadialChart = () => {
  const [timeRange, setTimeRange] = useState("6m")
  const [chartData, setChartData] = useState(allData.slice(-6))

  const handleRangeChange = (value) => {
    setTimeRange(value)
    switch (value) {
      case "tomorrow":
        setChartData(allData.slice(-1))
        break
      case "5d":
        setChartData(allData.slice(-5))
        break
      case "1m":
        setChartData(allData.slice(-30))
        break
      case "6m":
      default:
        setChartData(allData.slice(-68))
        break
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle>Radar Chart - Custom Label</CardTitle>
          <CardDescription>
            Showing total visitors for the selected period
          </CardDescription>
        </div>

        {/* Dropdown */}
        <Select value={timeRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="5d">Last 5 Days</SelectItem>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
  dataKey="month"
  tick={({ x, y, textAnchor, value, index }) => {
    const data = chartData[index]
    return (
      <text
        x={x}
        y={index === 0 ? y - 10 : y}
        textAnchor={textAnchor}
        dominantBaseline="middle"  // ✅ proper vertical alignment
        fontSize={13}
        fontWeight={500}
      >
        <tspan>{data.desktop}</tspan>
        <tspan className="fill-muted-foreground">/</tspan>
        <tspan>{data.mobile}</tspan>
        <tspan
          x={x}
          dy="1rem"
          fontSize={12}
          className="fill-muted-foreground"
        >
          {data.month}
        </tspan>
      </text>
    )
  }}
/>


            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
            <Radar dataKey="mobile" fill="var(--color-mobile)" />
          </RadarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Data from selected range
        </div>
      </CardFooter>
    </Card>
  )
}

export default RadialChart
