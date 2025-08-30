"use client"

import { motion } from "framer-motion"
import { Brain, Zap } from "lucide-react"

interface DeepSeekLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  animated?: boolean
  className?: string
}

export function DeepSeekLogo({ size = "md", showText = true, animated = false, className = "" }: DeepSeekLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center`}
        animate={
          animated
            ? {
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }
            : {}
        }
        transition={
          animated
            ? {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
            : {}
        }
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 },
        }}
      >
        <div className="relative">
          <motion.div
            animate={
              animated
                ? {
                    rotateY: [0, 360],
                  }
                : {}
            }
            transition={
              animated
                ? {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : {}
            }
          >
            <Brain
              className={`${size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"} text-primary-foreground`}
            />
          </motion.div>
          {animated && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Zap className={`${size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"} text-yellow-500`} />
            </motion.div>
          )}
        </div>
      </motion.div>
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span
            className={`font-bold text-primary ${textSizeClasses[size]}`}
            animate={
              animated
                ? {
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }
                : {}
            }
            transition={
              animated
                ? {
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : {}
            }
          >
            DeepSeek
          </motion.span>
          {size !== "sm" && (
            <motion.span
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Intelligence Artificielle
            </motion.span>
          )}
        </motion.div>
      )}
    </div>
  )
}
