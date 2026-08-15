"use client"
import { useState, useRef, useCallback } from 'react'

export interface Slide {
  src: string
  alt: string
  caption?: string
}

interface Props {
  slides: Slide[]
}

const SWIPE_THRESHOLD = 50
const EDGE_RESISTANCE = 0.3

export function BlogCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(0) // live drag offset in px
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const startX = useRef<number | null>(null)

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(slides.length - 1, i)),
    [slides.length],
  )
  const go = useCallback((i: number) => setIndex(prev => clamp(typeof i === 'number' ? i : prev)), [clamp])

  const atStart = index === 0
  const atEnd = index === slides.length - 1

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    },
    [go, index],
  )

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // ignore drags starting on the arrow buttons
    if ((e.target as HTMLElement).closest('button')) return
    startX.current = e.clientX
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (startX.current === null) return
    let delta = e.clientX - startX.current
    // resist dragging past the first / last slide
    if ((atStart && delta > 0) || (atEnd && delta < 0)) delta *= EDGE_RESISTANCE
    setDrag(delta)
  }, [atStart, atEnd])

  const endDrag = useCallback(() => {
    if (startX.current === null) return
    if (drag < -SWIPE_THRESHOLD) go(index + 1)
    else if (drag > SWIPE_THRESHOLD) go(index - 1)
    startX.current = null
    setDrag(0)
    setDragging(false)
  }, [drag, go, index])

  if (slides.length === 0) return null

  const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    [side]: '0.5rem',
    transform: 'translateY(-50%)',
    width: '2.25rem',
    height: '2.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: '1.25rem',
    lineHeight: 1,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    userSelect: 'none',
    zIndex: 2,
  })

  return (
    <figure style={{ margin: '2rem 0' }}>
      <div
        ref={frameRef}
        className="carousel-frame"
        role="group"
        aria-roledescription="carousel"
        aria-label="San Francisco photos"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: 'min(65vh, 560px)',
          borderRadius: '4px',
          background: 'var(--bg)',
          outline: 'none',
          touchAction: 'pan-y',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            transform: `translateX(calc(${-index * 100}% + ${drag}px))`,
            transition: dragging ? 'none' : 'transform 0.3s ease',
          }}
        >
          {slides.map((slide, i) => (
            <div key={i} style={{ flex: '0 0 100%', height: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous photo"
          onClick={() => go(index - 1)}
          disabled={atStart}
          style={arrowStyle('left')}
        >
          ‹
        </button>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next photo"
          onClick={() => go(index + 1)}
          disabled={atEnd}
          style={arrowStyle('right')}
        >
          ›
        </button>
      </div>

      {slides.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.15rem', marginTop: '0.75rem' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className="carousel-dot"
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.4rem',
                height: '1.4rem',
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: i === index ? 'var(--text)' : 'var(--border)',
                  transition: 'background 0.2s, transform 0.2s',
                }}
              />
            </button>
          ))}
        </div>
      )}

      {slides[index].caption && (
        <figcaption
          style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            textAlign: 'center',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }}
        >
          {slides[index].caption}
        </figcaption>
      )}
    </figure>
  )
}
