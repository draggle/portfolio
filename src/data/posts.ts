export interface Post {
  id: number
  title: string
  date: string
  excerpt: string
}

export const posts: Post[] = [
  {
    id: 1,
    title: 'hello world',
    date: '2026-06-18',
    excerpt: 'My first blog post. A quick introduction to what I plan to write about here.',
  },
]
