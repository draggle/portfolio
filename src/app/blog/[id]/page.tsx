import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { posts } from '@/data/posts'
import BlogPostLayout from '@/components/BlogPostLayout'

export function generateStaticParams() {
  return posts.map(p => ({ id: String(p.id) }))
}
export const dynamicParams = false

function getPost(id: string) {
  return posts.find(p => p.id === Number(id))
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const post = getPost(id)
  if (!post) notFound()
  return { title: `${post!.title} — ayan bin saif` }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = getPost(id)
  if (!post) notFound()

  const { default: Content } = await import(`@/content/blog/${id}.mdx`)

  return (
    <BlogPostLayout title={post.title} date={post.date} readTimeMinutes={post.readTimeMinutes}>
      <Content />
    </BlogPostLayout>
  )
}
