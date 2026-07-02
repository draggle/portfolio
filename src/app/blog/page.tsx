import Link from 'next/link'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'blog — ayan bin saif',
  description: 'writing by ayan bin saif on hackathons, waterloo, and building software.',
  path: '/blog',
})

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="projects-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>
      <div>
        <h1 className="page-title">blog</h1>
        <span className="page-title-line" />
      </div>
      <div className="projects-list">
        {sorted.length === 0 && (
          <p className="blog-empty">no posts yet. check back soon.</p>
        )}
        {sorted.map(post => (
          <div key={post.id} className="project-list-item">
            <div className="project-list-header">
              <h2 className="project-list-title">{post.title}</h2>
              <Link href={`/blog/${post.id}`} className="nyx-link">
                read post →
              </Link>
            </div>
            <p className="blog-list-date">{formatDate(post.date)}</p>
            <p className="project-list-desc">{post.excerpt}</p>
          </div>
        ))}
      </div>
      <div className="view-all">
        <a href="/rss.xml" className="nyx-link">subscribe via rss →</a>
      </div>
    </div>
  )
}
