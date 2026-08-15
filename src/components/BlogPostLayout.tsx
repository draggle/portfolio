import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Props {
  title: string
  date: string
  readTimeMinutes: number
  children: React.ReactNode
}

export default function BlogPostLayout({ title, date, readTimeMinutes, children }: Props) {
  return (
    <div className="page">
      <p><Link href="/writing">← Writing</Link></p>
      <h1>{title}</h1>
      <p className="muted">{formatDate(date)} · {readTimeMinutes} min read</p>
      <div className="prose">{children}</div>
    </div>
  )
}
