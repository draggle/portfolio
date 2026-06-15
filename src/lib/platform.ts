'use client'

import { useEffect, useState } from 'react'

export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
}

/** e.g. ⌘cmd on macOS, ctrl elsewhere — both 4 monospace chars, no layout shift */
export function modShortcut(key: string, isMac: boolean): string {
  return isMac ? '⌘cmd' : 'ctrl'
}

export function useIsMacOS(): boolean | null {
  const [isMac, setIsMac] = useState<boolean | null>(null)
  useEffect(() => setIsMac(isMacOS()), [])
  return isMac
}
