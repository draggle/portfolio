import Link from 'next/link'
import type { Metadata } from 'next'
import { posts } from '@/data/posts'

export const metadata: Metadata = {
  title: 'blog — ayan bin saif',
}

export default function BlogPage() {
  const sorted = [...posts].reverse()

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
            <p className="blog-list-date">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="project-list-desc">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
