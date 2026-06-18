import Link from 'next/link'

interface Props {
  title: string
  date: string
  readTimeMinutes: number
  children: React.ReactNode
}

export default function BlogPostLayout({ title, date, readTimeMinutes, children }: Props) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="blog-post-page">
      <Link href="/blog" className="nyx-link back-link">← blog</Link>
      <div className="blog-post-header">
        <h1 className="blog-post-title">{title}</h1>
        <p className="blog-post-meta">{formatted} · {readTimeMinutes} min read</p>
      </div>
      <div className="blog-post-body">
        {children}
      </div>
    </div>
  )
}
