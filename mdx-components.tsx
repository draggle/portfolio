import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(): MDXComponents {
  return {
    img: ({ src, alt, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ''}
        {...props}
        style={{ maxWidth: '100%', borderRadius: '4px', margin: '1.5rem 0', display: 'block' }}
      />
    ),
  }
}
