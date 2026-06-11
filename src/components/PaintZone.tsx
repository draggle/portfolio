'use client'
import { useCallback, useEffect, useRef } from 'react'

const CELL = 20
const FADE_MS = 1400

export default function PaintZone({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const painting     = useRef(false)
  const cells        = useRef<Map<string, number>>(new Map())
  const rafRef       = useRef<number>(0)

  const getAccent = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c3aed'

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const now = Date.now()
    const accent = getAccent()

    for (const [key, ts] of cells.current) {
      const age = now - ts
      if (age > FADE_MS) { cells.current.delete(key); continue }
      const [col, row] = key.split(',').map(Number)
      const alpha = 0.4 * (1 - age / FADE_MS)
      ctx.fillStyle = accent
      ctx.globalAlpha = alpha
      ctx.fillRect(col * CELL, row * CELL, CELL, CELL)
    }
    ctx.globalAlpha = 1
    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      canvas.width  = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    rafRef.current = requestAnimationFrame(draw)
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  const paintCell = (e: React.MouseEvent) => {
    if (!painting.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const col = Math.floor((e.clientX - rect.left) / CELL)
    const row = Math.floor((e.clientY - rect.top) / CELL)
    cells.current.set(`${col},${row}`, Date.now())
  }

  return (
    <div
      ref={containerRef}
      className="paint-zone"
      onMouseDown={() => { painting.current = true }}
      onMouseUp={() => { painting.current = false }}
      onMouseLeave={() => { painting.current = false }}
      onMouseMove={paintCell}
    >
      <canvas ref={canvasRef} className="paint-canvas" aria-hidden="true" />
      {children}
    </div>
  )
}
