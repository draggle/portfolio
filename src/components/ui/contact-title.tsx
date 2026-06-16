'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function ContactTitle() {
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowTitle(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <h1 className="contact-title" style={{ minHeight: '2.4rem' }}>
      <AnimatePresence mode="wait">
        {!showTitle ? (
          <motion.span
            key="wave"
            initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
          >
            👋
          </motion.span>
        ) : (
          <motion.span key="title" style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.25em' }}>
            <motion.span
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
              style={{ display: 'inline-block' }}
            >
              get in touch
            </motion.span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.65 }}
              style={{ display: 'inline-block' }}
            >
              😊
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </h1>
  )
}
