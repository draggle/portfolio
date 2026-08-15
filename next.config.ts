import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // A stray package-lock.json in the home directory makes Next infer ~ as the
  // workspace root, so the dev watcher reloads on unrelated file changes.
  turbopack: { root: __dirname },
  async redirects() {
    return [
      { source: '/blog', destination: '/writing', permanent: true },
      { source: '/blog/:id(\\d+)', destination: '/writing/:id', permanent: true },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
