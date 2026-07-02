import { ImageResponse } from 'next/og'

export const alt = 'ayan bin saif — applied math @ waterloo · engineering @ tern'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: '#111111',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700 }}>ayan bin saif</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#999999', marginTop: 28 }}>
          applied math @ waterloo · engineering @ tern
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 96,
            display: 'flex',
            fontSize: 28,
            color: '#ef4444',
          }}
        >
          www.ayans.dev
        </div>
      </div>
    ),
    size
  )
}
