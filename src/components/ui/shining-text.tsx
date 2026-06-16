"use client"

import * as React from "react"
import { motion } from "motion/react"

export function ShiningText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      style={{
        background: "linear-gradient(110deg, var(--accent) 35%, color-mix(in srgb, var(--accent) 20%, white) 50%, var(--accent) 75%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    >
      {text}
    </motion.span>
  )
}
