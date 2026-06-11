'use client'
import { useEffect, useState } from 'react'
import Nav from './Nav'
import Terminal from './Terminal'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [termOpen, setTermOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark')
    }

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setTermOpen(v => !v)
      }
      if (e.key === 'Escape') setTermOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <Nav onTerminalOpen={() => setTermOpen(true)} />
      {children}
      <Terminal isOpen={termOpen} onClose={() => setTermOpen(false)} />
    </>
  )
}
