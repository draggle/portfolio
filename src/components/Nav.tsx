import Link from 'next/link'
import DarkModeToggle from './DarkModeToggle'
import TermNavLink from './TermNavLink'

export default function Nav() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-logo">ayans.dev</Link>
      <div className="nav-links">
        <a href="/#about" className="nav-section">about</a>
        <a href="/experience">experience</a>
        <Link href="/projects">projects</Link>
        <Link href="/contact">contact</Link>
        <TermNavLink />
        <DarkModeToggle />
      </div>
    </nav>
  )
}
