'use client'

import { useEffect, useState } from 'react'

export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
}

/** e.g. ⌘K on macOS, Ctrl+K elsewhere */
export function modShortcut(key: string, isMac: boolean): string {
  const k = key.length === 1 ? key.toUpperCase() : key
  return isMac ? `⌘${k}` : `Ctrl+${k}`
}

export function useIsMacOS(): boolean | null {
  const [isMac, setIsMac] = useState<boolean | null>(null)
  useEffect(() => setIsMac(isMacOS()), [])
  return isMac
}
