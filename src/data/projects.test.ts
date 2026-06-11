import { describe, it, expect } from 'vitest'
import { projects, type Project } from './projects'

describe('projects data', () => {
  it('has exactly 5 projects', () => {
    expect(projects).toHaveLength(5)
  })

  it('all slugs are unique', () => {
    const slugs = projects.map(p => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every project has required string fields', () => {
    projects.forEach(p => {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.shortDescription).toBeTruthy()
      expect(p.description.length).toBeGreaterThan(0)
      expect(p.tags.length).toBeGreaterThan(0)
      expect(p.thumbnail.emoji).toBeTruthy()
      expect(p.thumbnail.gradient).toBeTruthy()
    })
  })

  it('exactly 3 projects are featured', () => {
    expect(projects.filter(p => p.featured)).toHaveLength(3)
  })

  it('alphahedge has a video link', () => {
    const alpha = projects.find(p => p.slug === 'alphahedge')
    expect(alpha?.links.video).toBeTruthy()
  })
})
