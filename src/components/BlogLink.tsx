"use client"
import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

const previewMap: Record<string, string> = {
  // blog 1
  'https://www.ycombinator.com/': '/previews/yc.png',
  'https://events.ycombinator.com/fullstackhackathon': '/previews/yc-event.png',
  'https://uwflow.com/course/MATH135': '/previews/uwflow-math135.png',
  'https://uwflow.com/course/MATH137': '/previews/uwflow-math137.png',
  'https://www.playstation.com/': '/previews/playstation.png',
  'https://www.celsius.com/': '/previews/celsius.png',
  'https://www.sumacsf.com/': '/previews/sumac.png',
  'https://waymo.com/': '/previews/waymo.png',
  'https://en.wikipedia.org/wiki/Retrieval-augmented_generation': '/previews/rag-wiki.png',
  // blog 2
  'https://www.utoronto.ca': '/previews/utoronto.png',
  'https://uwaterloo.ca': '/previews/uwaterloo.png',
  'https://cs.uwaterloo.ca/current/courses/course_descriptions/cDescr/CS135': '/previews/uwaterloo-cs135.png',
  'https://cs.uwaterloo.ca/current/courses/course_descriptions/cDescr/CS136': '/previews/uwaterloo-cs136.png',
  'https://en.wikipedia.org/wiki/Racket_(programming_language)': '/previews/racket-wiki.png',
  'https://en.wikipedia.org/wiki/Lisp_(programming_language)': '/previews/lisp-wiki.png',
  'https://en.wikipedia.org/wiki/Scheme_(programming_language)': '/previews/scheme-wiki.png',
  'https://en.wikipedia.org/wiki/Functional_programming': '/previews/functional-programming-wiki.png',
  'https://leetcode.com/': '/previews/leetcode.png',
  'https://en.wiktionary.org/wiki/Cali_or_bust': '/previews/cali-or-bust-wiki.png',
  // internal
  '/projects/alphahedge': '/previews/alphahedge.png',
}

interface Props {
  href?: string
  children: React.ReactNode
}

interface PopupState {
  x: number
  y: number
  imageSrc: string
}

export function BlogLink({ href = '', children }: Props) {
  const [popup, setPopup] = useState<PopupState | null>(null)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const isExternal = href.startsWith('http')
  const imageSrc = previewMap[href]

  const handleMouseEnter = useCallback(() => {
    if (!imageSrc || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    setPopup({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY, imageSrc })
  }, [imageSrc])

  const handleMouseLeave = useCallback(() => setPopup(null), [])

  return (
    <>
      <a
        ref={anchorRef}
        href={href}
        className="nyx-link"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onMouseEnter={imageSrc ? handleMouseEnter : undefined}
        onMouseLeave={imageSrc ? handleMouseLeave : undefined}
      >
        {children}
      </a>
      {popup && createPortal(
        <div style={{
          position: 'absolute',
          left: popup.x,
          top: popup.y - 12,
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
          background: 'white',
          borderRadius: '12px',
          padding: '4px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
          pointerEvents: 'none',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={popup.imageSrc} width={200} height={125} style={{ borderRadius: '8px', display: 'block' }} alt="preview" />
        </div>,
        document.body
      )}
    </>
  )
}
