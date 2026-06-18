export interface Post {
  id: number
  title: string
  date: string
  excerpt: string
  readTimeMinutes: number
}

// Each entry MUST have a matching src/content/blog/[id].mdx file.
// Adding an entry without the file will crash the build.
export const posts: Post[] = [
  {
    id: 1,
    title: 'hello world',
    date: '2026-06-18',
    excerpt: 'My first blog post. A quick introduction to what I plan to write about here.',
    readTimeMinutes: 1,
  },
]
