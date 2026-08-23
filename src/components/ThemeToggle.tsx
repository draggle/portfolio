"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

// The `dark` class on <html> is the single source of truth -- layout.tsx's boot
// script sets it before first paint. Subscribing to it beats mirroring it into
// local state: no setState-in-effect, and the knob stays right if anything else
// changes the theme.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

const getSnapshot = () => document.documentElement.classList.contains("dark")

// No <html> to read while server-rendering; useSyncExternalStore re-checks the
// client snapshot after hydration and re-renders if they disagree.
const getServerSnapshot = () => false

export function ThemeToggle({ className }: ThemeToggleProps) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = () => {
    const next = !isDark
    document.documentElement.classList.toggle("dark", next)
    try {
      localStorage.setItem("theme", next ? "dark" : "light")
    } catch {}
  }

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer",
        // --bg/--border already flip with the theme, so no isDark branch here
        "border border-[var(--border)] bg-[var(--bg)]",
        className
      )}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          toggle()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            // same tint the site uses for inline code, so it reads in both themes
            "bg-[color-mix(in_srgb,var(--text)_10%,transparent)]",
            isDark ? "translate-x-0" : "translate-x-8"
          )}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-[var(--text)]" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-[var(--text)]" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark ? "" : "-translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[var(--muted)]" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-[var(--muted)]" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  )
}
