import Terminal from '@/components/Terminal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'terminal — ayan bin saif',
  description: 'an interactive terminal for exploring this site.',
  path: '/terminal',
})

export default function TerminalPage() {
  return <Terminal />
}
