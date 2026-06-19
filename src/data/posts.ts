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
    title: 'Why I believe the University of Waterloo is the best place to be',
    date: '2026-06-19',
    excerpt: 'Not because of the lectures — because of the culture. A take on why Waterloo produces great outcomes for students in tech, and what actually drives it.',
    readTimeMinutes: 4,
  },
]
