'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Nav from './Nav'
import { FallingPattern } from '@/components/ui/falling-pattern'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark')
    }
    setMounted(true)

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        router.push('/terminal')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <>
      {mounted && ['/', '/contact', '/projects', '/experience', '/blog'].includes(pathname) && (
        <div className="falling-col" aria-hidden="true">
          <FallingPattern
            color="var(--accent)"
            backgroundColor="var(--bg)"
            duration={80}
            blurIntensity="0.5rem"
            density={2}
            className="h-full w-full"
          />
        </div>
      )}
      <Nav />
      {children}
    </>
  )
}
