"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedLinkProps {
  href: string
  text: string
  className?: string
  textClassName?: string
  staggerChildren?: number
  yOffset?: number
  duration?: number
}

export const AnimatedLink = ({
  href,
  text,
  className,
  textClassName,
  staggerChildren = 0.03,
  yOffset = 100,
  duration = 0.3,
}: AnimatedLinkProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Split text into individual characters
  const characters = text.split("")

  return (
    <Link
      href={href}
      className={cn("relative inline-block px-3 py-2 overflow-hidden rounded-md", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="sr-only">{text}</span>
      <div className="relative overflow-hidden">
        {/* First row of characters (moving down) */}
        <div className={cn("flex items-center justify-center font-medium", textClassName)}>
          {characters.map((char, index) => (
            <motion.span
              key={`char-${index}`}
              initial={{ y: 0 }}
              animate={{
                y: isHovered ? `${yOffset}%` : 0,
              }}
              transition={{
                duration: duration,
                ease: "easeInOut",
                delay: isHovered ? 0.1 + index * staggerChildren : 0.1 + 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        {/* Second row of characters (moving up) */}
        <div
          className={cn("flex items-center justify-center font-medium absolute top-0 left-0 right-0", textClassName)}
        >
          {characters.map((char, index) => (
            <motion.span
              key={`second-char-${index}`}
              initial={{ y: `-${yOffset}%` }}
              animate={{
                y: isHovered ? 0 : `-${yOffset}%`,
              }}
              transition={{
                duration: duration,
                ease: "easeInOut",
                delay: isHovered ? 0.1 + index * staggerChildren : 0.1 + 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>
    </Link>
  )
}

