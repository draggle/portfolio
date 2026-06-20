'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = '_!X$0-+*#'
const STEP_MS = 35
const HOLD_FRAMES = 2 // scramble frames per revealed character

function randChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export default function ScrambleLogo({ text }: { text: string }) {
  const [display, setDisplay] = useState(text)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(0)

  const stop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const play = useCallback(() => {
    stop()
    frameRef.current = 0
    const total = text.length * (HOLD_FRAMES + 1)

    timerRef.current = setInterval(() => {
      const frame = frameRef.current++
      if (frame >= total) {
        setDisplay(text)
        stop()
        return
      }
      const revealed = Math.floor(frame / (HOLD_FRAMES + 1))
      setDisplay(text.split('').map((ch, i) => (i < revealed ? ch : randChar())).join(''))
    }, STEP_MS)
  }, [text])

  useEffect(() => {
    play()
    return stop
  }, [play])

  return (
    <span className="font-mono" onMouseEnter={play}>
      {display}
    </span>
  )
}
