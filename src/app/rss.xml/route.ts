import { posts } from '@/data/posts'
import { buildRssXml } from '@/lib/rss'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildRssXml(posts), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
