import { describe, it, expect } from 'vitest'
import { SITE_URL, pageMetadata, buildSitemapEntries } from './seo'
import { posts } from '@/data/posts'
import { projects } from '@/data/projects'
import { experiences } from '@/data/experience'

describe('SITE_URL', () => {
  it('is the canonical www domain without trailing slash', () => {
    expect(SITE_URL).toBe('https://www.ayans.dev')
  })
})

describe('pageMetadata', () => {
  it('builds website metadata with canonical path and OG/twitter blocks', () => {
    const meta = pageMetadata({
      title: 'projects — ayan bin saif',
      description: 'some description',
      path: '/projects',
    })
    expect(meta.title).toBe('projects — ayan bin saif')
    expect(meta.description).toBe('some description')
    expect(meta.alternates?.canonical).toBe('/projects')
    expect(meta.alternates?.types).toMatchObject({
      'application/rss+xml': 'https://www.ayans.dev/rss.xml',
    })
    expect(meta.openGraph).toMatchObject({
      title: 'projects — ayan bin saif',
      description: 'some description',
      url: '/projects',
      siteName: 'ayan bin saif',
      type: 'website',
      locale: 'en_US',
    })
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('builds article metadata with publishedTime for blog posts', () => {
    const meta = pageMetadata({
      title: 'a post — ayan bin saif',
      description: 'excerpt',
      path: '/blog/1',
      ogType: 'article',
      publishedTime: '2026-02-15',
    })
    expect(meta.openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-02-15',
      url: '/blog/1',
    })
  })
})

describe('buildSitemapEntries', () => {
  const entries = buildSitemapEntries()
  const urls = entries.map(e => e.url)

  it('includes all static routes, including /terminal', () => {
    for (const path of ['', '/experience', '/projects', '/blog', '/contact', '/terminal']) {
      expect(urls).toContain(`https://www.ayans.dev${path}`)
    }
  })

  it('includes every blog post with its date as lastModified', () => {
    for (const post of posts) {
      const entry = entries.find(e => e.url === `https://www.ayans.dev/blog/${post.id}`)
      expect(entry).toBeDefined()
      expect(entry!.lastModified).toEqual(new Date(post.date + 'T00:00:00Z'))
    }
  })

  it('includes every project and experience detail page', () => {
    for (const p of projects) {
      expect(urls).toContain(`https://www.ayans.dev/projects/${p.slug}`)
    }
    for (const e of experiences) {
      expect(urls).toContain(`https://www.ayans.dev/experience/${e.id}`)
    }
  })

  it('contains no duplicate urls', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })
})
