"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const Ceditscore = ({ value = 700, min = 300, max = 900 }) => {
  // ✅ Gauge logic
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  // ✅ Recharts data must use % for bar fill
  const chartData = [{ score: pct, fill: "var(--color-safari)" }]

  const chartConfig = {
    score: { label: "Score" },
  }

  return (
    <Card className="flex flex-col">
      {/* Header */}
      <CardHeader className="items-center pb-0">
        <CardTitle>CIBIL Score</CardTitle>
        <CardDescription>Range {min} – {max}</CardDescription>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={80}
            outerRadius={140}
            startAngle={180} // half circle
            endAngle={180 + (pct * 1.8)} // convert % to degrees
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="score" background cornerRadius={10} />

            {/* Center label */}
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          CIBIL Score
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Based on your credit history
        </div>
      </CardFooter>
    </Card>
  )
}

export default Ceditscore
