import type { Metadata } from 'next'
import Terminal from '@/components/Terminal'

export const metadata: Metadata = {
  title: 'terminal — ayan bin saif',
}

export default function TerminalPage() {
  return <Terminal />
}
