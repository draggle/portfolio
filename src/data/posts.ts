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
    title: 'My experience attending a Y Combinator hackathon (and visiting San Francisco)',
    date: '2026-02-15',
    excerpt: 'My first time in SF — sleep-deprived, building an AI investment platform, riding a Waymo, and missing two quizzes. Worth every second.',
    readTimeMinutes: 3,
  },
  {
    id: 2,
    title: 'Why I believe the University of Waterloo is the best place to be',
    date: '2026-06-19',
    excerpt: 'Not because of the lectures — because of the culture. A take on why Waterloo produces great outcomes for students in tech, and what actually drives it.',
    readTimeMinutes: 4,
  },
]
