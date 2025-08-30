"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface SliderItem {
  id: string
  name: string
  avgRiskScore: number
  riskLevel: string
  analysisCount: number
}

interface CardsStackSliderProps {
  items: SliderItem[]
  type: "company" | "supplier"
  title: string
}

export function CardsStackSlider({ items, type, title }: CardsStackSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [items.length])

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "faible":
        return "bg-green-100 text-green-800 border-green-200"
      case "modéré":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "élevé":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const Icon = type === "company" ? Building2 : Users
  const iconColor = type === "company" ? "text-blue-600" : "text-purple-600"

  if (items.length === 0) {
    return (
      <Card className="h-48 flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-center">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative h-56 overflow-hidden">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        {title}
      </h3>

      <div className="relative h-44">
        {[0, 1, 2].map((offset) => {
          const itemIndex = Math.abs(currentIndex + offset) % items.length
          const item = items[itemIndex]

          return (
            <motion.div
              key={`${currentIndex}-${offset}`}
              className="absolute inset-0"
              initial={{
                x: offset * 15,
                y: offset * 6,
                scale: 1 - offset * 0.04,
                opacity: 1 - offset * 0.25,
                zIndex: 10 - offset,
              }}
              animate={{
                x: offset * 15,
                y: offset * 6,
                scale: 1 - offset * 0.04,
                opacity: 1 - offset * 0.25,
                zIndex: 10 - offset,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <Card className={`w-full h-36 ${offset === 0 ? "shadow-lg" : "shadow-md"} border-2`}>
                <CardContent className="p-3 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-xs truncate mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.analysisCount} analyse{item.analysisCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <Icon className={`h-3 w-3 ${iconColor} flex-shrink-0 ml-2`} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getRiskBadgeColor(item.riskLevel)} text-xs px-2 py-0.5`} variant="secondary">
                      {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-base font-bold text-foreground">{item.avgRiskScore.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">/12</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center mt-2 gap-0.5">
        {items.slice(0, Math.min(items.length, 5)).map((_, index) => (
          <motion.div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              index === (currentIndex % items.length) ? "bg-primary" : "bg-muted"
            }`}
            animate={{
              scale: index === currentIndex % items.length ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
