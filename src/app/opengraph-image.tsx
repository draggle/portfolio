import { ImageResponse } from 'next/og'

export const alt = 'Ayan Bin Saif — Applied Math @ Waterloo · Engineering @ TERN'
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
          background: '#ffffff',
          color: '#111111',
        }}
      >
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700 }}>Ayan Bin Saif</div>
        <div style={{ display: 'flex', fontSize: 34, color: '#666666', marginTop: 28 }}>
          Applied Math @ Waterloo · Engineering @ TERN
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 96,
            display: 'flex',
            fontSize: 28,
            color: '#666666',
          }}
        >
          www.ayans.dev
        </div>
      </div>
    ),
    size
  )
}
