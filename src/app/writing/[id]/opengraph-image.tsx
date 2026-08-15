import { ImageResponse } from 'next/og'
import { posts } from '@/data/posts'
import { formatDate } from '@/lib/utils'

export const alt = 'Writing by Ayan Bin Saif'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = posts.find(p => p.id === Number(id))
  const title = post?.title ?? 'Writing'
  const date = post ? formatDate(post.date) : ''
  const titleSize = title.length > 60 ? 52 : 64

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
        <div style={{ display: 'flex', fontSize: 28, color: '#ef4444' }}>Writing · {date}</div>
        <div
          style={{
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.2,
            marginTop: 28,
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 96,
            display: 'flex',
            fontSize: 28,
            color: '#999999',
          }}
        >
          www.ayans.dev · Ayan Bin Saif
        </div>
      </div>
    ),
    size
  )
}
