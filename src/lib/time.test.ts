import { describe, it, expect } from 'vitest'
import { getWaterlooTime } from './time'

describe('getWaterlooTime', () => {
  it('returns an object with time and icon', () => {
    const result = getWaterlooTime()
    expect(result).toHaveProperty('time')
    expect(result).toHaveProperty('icon')
  })

  it('icon is either sun or moon', () => {
    const { icon } = getWaterlooTime()
    expect(['☀️', '🌙']).toContain(icon)
  })

  it('time string is non-empty and contains AM or PM', () => {
    const { time } = getWaterlooTime()
    expect(time.length).toBeGreaterThan(0)
    expect(time).toMatch(/AM|PM/)
  })
})
