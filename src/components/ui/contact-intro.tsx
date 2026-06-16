'use client'

import { motion } from 'framer-motion'
import { ShiningText } from './shining-text'

const WORDS = [
  "i'm", "currently", "open", "to", "__winter__", "2027", "co-op",
  "opportunities.", "feel", "free", "to", "reach", "out", "about",
  "roles,", "collaborations,", "or", "just", "to", "chat."
]

export function ContactIntro() {
  return (
    <p className="contact-intro">
      {WORDS.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 + i * 0.035, duration: 0.3, ease: 'easeOut' }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word === '__winter__' ? (
            <span className="tooltip-word" data-tooltip="January — April">
              <ShiningText text="winter" />
            </span>
          ) : word}
        </motion.span>
      ))}
    </p>
  )
}
