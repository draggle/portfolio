import type { Post } from '@/data/posts'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './seo'

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildRssXml(posts: Post[]): string {
  const items = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(post => {
      const link = `${SITE_URL}/writing/${post.id}`
      const pubDate = new Date(post.date + 'T00:00:00Z').toUTCString()
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
}
