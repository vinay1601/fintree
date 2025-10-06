"use client"

import React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card as UICard,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion, useSpring, useTransform } from "framer-motion"

const StatCard = ({ title, price, percentage, line1, line2 }) => {
  const isPositive = percentage >= 0
  const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown
  const percentText = `${isPositive ? "+" : ""}${percentage}%`

  // Extract numeric value from price
  const numericPrice =
    parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0

  // Framer Motion spring for smooth animation
  const springValue = useSpring(0, { stiffness: 60, damping: 15 })
  const animatedPrice = useTransform(springValue, (latest) =>
    Math.floor(latest).toLocaleString()
  )

  React.useEffect(() => {
    springValue.set(numericPrice) // Animate to the new price
  }, [numericPrice, springValue])

  return (
    <UICard className="@container/card border border-primary/20 shadow-md hover:shadow-lg transition">
      <CardHeader>
        {/* Title */}
        <CardDescription className="text-neutral-500">{title}</CardDescription>

        {/* Price */}
        <CardTitle className="text-2xl font-semibold text-primary tabular-nums @[250px]/card:text-3xl">
          ₹<motion.span>{animatedPrice}</motion.span>
        </CardTitle>

        {/* Percentage Badge */}
        <CardAction>
          <Badge
            className={`px-2 py-1 rounded-md ${
              isPositive
                ? "bg-primary-light/20 text-primary"
                : "bg-red-100 text-red-600"
            }`}
          >
            <TrendIcon className="mr-1 h-4 w-4" />
            {percentText}
          </Badge>
        </CardAction>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div
          className={`line-clamp-1 flex gap-2 font-medium ${
            isPositive ? "text-primary" : "text-red-600"
          }`}
        >
          {line1} <TrendIcon className="size-4" />
        </div>
        <div className="text-neutral-500">{line2}</div>
      </CardFooter>
    </UICard>
  )
}

export default StatCard
