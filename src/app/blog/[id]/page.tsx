import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { posts } from '@/data/posts'
import BlogPostLayout from '@/components/BlogPostLayout'
import { readTime } from '@/lib/utils'

export function generateStaticParams() {
  return posts.map(p => ({ id: String(p.id) }))
}

export const dynamicParams = false

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const post = posts.find(p => p.id === Number(id))
  return { title: post ? `${post.title} — ayan bin saif` : 'post not found' }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = posts.find(p => p.id === Number(id))
  if (!post) notFound()

  const { default: Content } = await import(`@/content/blog/${id}.mdx`)

  const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${id}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const minutes = readTime(raw)

  return (
    <BlogPostLayout title={post.title} date={post.date} readTimeMinutes={minutes}>
      <Content />
    </BlogPostLayout>
  )
}
