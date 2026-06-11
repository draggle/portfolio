export interface WaterlooTime {
  time: string
  icon: '☀️' | '🌙'
}

export function getWaterlooTime(): WaterlooTime {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const hourStr = now.toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    hour12: false,
  })
  const hour = parseInt(hourStr, 10)
  return { time, icon: hour >= 6 && hour < 21 ? '☀️' : '🌙' }
}
