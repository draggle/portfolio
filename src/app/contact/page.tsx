import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'contact — ayan bin saif',
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <Link href="/" className="nyx-link back-link">← ayan bin saif</Link>

      <h1 className="contact-title">get in touch</h1>
      <p className="contact-intro">
        i'm currently open to winter 2027 co-op opportunities. feel free to reach out
        about roles, collaborations, or anything else.
      </p>

      <div className="contact-primary">
        <a href="mailto:ayan.binsaif@uwaterloo.ca" className="contact-email nyx-link">
          ayan.binsaif@uwaterloo.ca
        </a>
      </div>

      <div className="contact-section">
        <div className="sec-label">elsewhere</div>
        <div className="contact-links">
          <a
            href="https://github.com/draggle"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-row"
          >
            <span className="contact-link-label">github</span>
            <span className="nyx-link contact-link-value">github.com/draggle ↗</span>
          </a>
          <a
            href="https://linkedin.com/in/stitches"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-row"
          >
            <span className="contact-link-label">linkedin</span>
            <span className="nyx-link contact-link-value">linkedin.com/in/stitches ↗</span>
          </a>
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
