'use client'
import { useEffect, useState } from 'react'
import { getWaterlooTime, type WaterlooTime } from '@/lib/time'

export default function LocationWidget() {
  const [data, setData] = useState<WaterlooTime>({ time: '—', icon: '☀️' })

  useEffect(() => {
    setData(getWaterlooTime())
    const id = setInterval(() => setData(getWaterlooTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="loc-widget">
      <div className="live-dot" />
      <span>Waterloo, ON</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span>{data.time}</span>
      <span>{data.icon}</span>
    </div>
  )
}
