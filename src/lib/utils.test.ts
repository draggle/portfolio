import { describe, it, expect } from 'vitest'
import { readTime } from './utils'

describe('readTime', () => {
  it('returns 1 for short content', () => {
    expect(readTime('hello world')).toBe(1)
  })

  it('returns 1 for exactly 200 words', () => {
    const content = Array(200).fill('word').join(' ')
    expect(readTime(content)).toBe(1)
  })

  it('returns 2 for 201 words', () => {
    const content = Array(201).fill('word').join(' ')
    expect(readTime(content)).toBe(2)
  })

  it('returns 1 for empty string', () => {
    expect(readTime('')).toBe(1)
  })

  it('ignores MDX frontmatter-style export lines', () => {
    const mdx = `export const metadata = { title: 'x' }\n\n${'word '.repeat(150)}`
    expect(readTime(mdx)).toBe(1)
  })
})
