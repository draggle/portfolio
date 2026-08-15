import Link from 'next/link'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Writing — Ayan Bin Saif',
  description: 'Writing by Ayan Bin Saif on hackathons, Waterloo, and building software.',
  path: '/writing',
})

export default function WritingPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page">
      <h1>Writing</h1>
      {sorted.length === 0 && <p className="muted">No posts yet.</p>}
      <ul className="item-list">
        {sorted.map(post => (
          <li key={post.id}>
            <Link href={`/writing/${post.id}`}>{post.title}</Link>
            <p className="muted">{formatDate(post.date)} · {post.readTimeMinutes} min read</p>
            <p>{post.excerpt}</p>
          </li>
        ))}
      </ul>
      <p><a href="/rss.xml">Subscribe via RSS</a></p>
    </div>
  )
}
