'use client'

import { useState } from 'react'
import { SpecialText } from '@/components/ui/special-text'

export default function ScrambleLogo({ text }: { text: string }) {
  const [key, setKey] = useState(0)

  return (
    <span onMouseEnter={() => setKey(k => k + 1)}>
      <SpecialText key={key} speed={15} className="font-mono">{text}</SpecialText>
    </span>
  )
}
