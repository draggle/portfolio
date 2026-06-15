'use client'

import Link from 'next/link'
import { modShortcut, useIsMacOS } from '@/lib/platform'

export default function TermNavLink() {
  const isMac = useIsMacOS()
  const shortcut = isMac === null ? 'ctrl' : modShortcut('K', isMac)

  return (
    <Link href="/terminal" className="term-btn">
      <span suppressHydrationWarning>{shortcut}</span> terminal
    </Link>
  )
}
