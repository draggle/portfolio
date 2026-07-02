import { describe, it, expect } from 'vitest'
import { escapeXml, buildRssXml } from './rss'
import type { Post } from '@/data/posts'

const samplePosts: Post[] = [
  {
    id: 1,
    title: 'Tips & tricks for <MDX>',
    date: '2026-02-15',
    excerpt: 'It\'s "fun"',
    readTimeMinutes: 3,
  },
  {
    id: 2,
    title: 'Second post',
    date: '2026-06-19',
    excerpt: 'Another excerpt',
    readTimeMinutes: 4,
  },
]

describe('escapeXml', () => {
  it('escapes all five xml special characters', () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;'
    )
  })

  it('leaves plain text untouched', () => {
    expect(escapeXml('hello world')).toBe('hello world')
  })
})

describe('buildRssXml', () => {
  const xml = buildRssXml(samplePosts)

  it('is an rss 2.0 document with the site channel', () => {
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<link>https://www.ayans.dev/blog</link>')
  })

  it('contains one item per post with absolute links', () => {
    expect(xml).toContain('<link>https://www.ayans.dev/blog/1</link>')
    expect(xml).toContain('<link>https://www.ayans.dev/blog/2</link>')
    expect(xml).toContain('<guid>https://www.ayans.dev/blog/1</guid>')
  })

  it('escapes titles and excerpts', () => {
    expect(xml).toContain('Tips &amp; tricks for &lt;MDX&gt;')
    expect(xml).not.toContain('<MDX>')
  })

  it('lists newest posts first', () => {
    expect(xml.indexOf('/blog/2</link>')).toBeLessThan(xml.indexOf('/blog/1</link>'))
  })

  it('formats pubDate as UTC rfc822', () => {
    expect(xml).toContain('<pubDate>Sun, 15 Feb 2026 00:00:00 GMT</pubDate>')
  })
})
