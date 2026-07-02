import Link from 'next/link'
import { LinkPreview } from '@/components/ui/link-preview'
import { LinkedInBadgePreview } from '@/components/ui/linkedin-badge-preview'
import { ContactTitle } from '@/components/ui/contact-title'
import { ContactIntro } from '@/components/ui/contact-intro'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'contact — ayan bin saif',
  description: 'get in touch with ayan bin saif — email, github, linkedin.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="contact-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>

      <ContactTitle />
      <ContactIntro />

      <div className="contact-primary">
        <a href="mailto:ayan.binsaif@uwaterloo.ca" className="contact-email nyx-link">
          ayan.binsaif@uwaterloo.ca
        </a>
      </div>

      <div className="contact-section">
        <div className="sec-label">elsewhere</div>
        <div className="contact-links">
          <LinkPreview
            url="https://github.com/draggle"
            className="contact-link-row"
            isStatic
            imageSrc="/previews/github.png"
          >
            <span className="contact-link-label">github</span>
            <span className="nyx-link contact-link-value">github.com/draggle ↗</span>
          </LinkPreview>

          <LinkedInBadgePreview className="contact-link-row">
            <span className="contact-link-label">linkedin</span>
            <span className="nyx-link contact-link-value">linkedin.com/in/stitches ↗</span>
          </LinkedInBadgePreview>

          <a
            href="https://github.com/draggle/portfolio/raw/main/Ayan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-row"
          >
            <span className="contact-link-label">resume</span>
            <span className="nyx-link contact-link-value">download pdf ↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
