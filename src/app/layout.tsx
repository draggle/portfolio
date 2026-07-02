import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import LayoutClient from '@/components/LayoutClient'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, pageMetadata } from '@/lib/seo'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: '/' }),
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Berkeley+Mono&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
        />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
        <Analytics />
      </body>
    </html>
  )
}
