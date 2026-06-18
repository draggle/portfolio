import { describe, it, expect } from 'vitest'
import { posts, type Post } from './posts'

describe('posts registry', () => {
  it('is an array', () => {
    expect(Array.isArray(posts)).toBe(true)
  })

  it('all post ids are unique', () => {
    const ids = posts.map((p: Post) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every post has required fields', () => {
    posts.forEach((p: Post) => {
      expect(typeof p.id).toBe('number')
      expect(p.id).toBeGreaterThan(0)
      expect(typeof p.title).toBe('string')
      expect(p.title.length).toBeGreaterThan(0)
      expect(typeof p.date).toBe('string')
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(typeof p.excerpt).toBe('string')
      expect(p.excerpt.length).toBeGreaterThan(0)
    })
  })

  it('ids are sequential starting at 1', () => {
    const sorted = [...posts].sort((a, b) => a.id - b.id)
    sorted.forEach((p, i) => expect(p.id).toBe(i + 1))
  })
})
