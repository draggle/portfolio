import type { Metadata, MetadataRoute } from 'next'
import { posts } from '@/data/posts'
import { projects } from '@/data/projects'
import { experiences } from '@/data/experience'

export const SITE_URL = 'https://www.ayans.dev'
export const SITE_NAME = 'Ayan Bin Saif'
export const SITE_DESCRIPTION =
  'Applied Mathematics with Scientific Computing and Scientific Machine Learning student at the University of Waterloo. Software engineer.'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
  publishedTime?: string
}

export function pageMetadata(opts: PageMetadataOptions): Metadata {
  const { title, description, path, ogType = 'website', publishedTime } = opts
  const shared = { title, description, url: path, siteName: SITE_NAME, locale: 'en_US' }
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
    },
    openGraph:
      ogType === 'article'
        ? { ...shared, type: 'article', publishedTime }
        : { ...shared, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/experience', '/projects', '/writing']
  return [
    ...staticPaths.map(path => ({ url: `${SITE_URL}${path}` })),
    ...experiences.map(e => ({ url: `${SITE_URL}/experience/${e.id}` })),
    ...projects.map(p => ({ url: `${SITE_URL}/projects/${p.slug}` })),
    ...posts.map(p => ({
      url: `${SITE_URL}/writing/${p.id}`,
      lastModified: new Date(p.date + 'T00:00:00Z'),
    })),
  ]
}
